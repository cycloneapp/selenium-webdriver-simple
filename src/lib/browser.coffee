[   
    $err
    $selenium
    util
    Matcher
] = [
    require 'common-errors'
    require './selenium'
    require './util'
    require './matcher'
]

###
Class mixins
###
[
    BrowserContext
    BrowserCommands
    BrowserDOMActions
] = [
    require './browser/context'
    require './browser/commands'
    require './browser/dom-actions'
]

#console.log BrowserCommands

class Browser extends util.Modules.Logger
    uid:      null
    client:   null
    server:   null

    #@Matcher = extend {}, $match

    @include BrowserContext
    @include BrowserCommands
    @include BrowserDOMActions
    ###
    @var bool Use verbose output
    ###
    verbose: no

    ###
    @var mixed Current Browser context
    @private
    ###
    _context: null

    @Errors = $err

    constructor: (config = {}) ->
        super()

        @_init config

        if @isAutostart()
            @info 'autostart'
            @start()
        
            if not @isSrvRunning() and @isAutostart()
                throw new $err.Error 'Selenium server is not running'
        else
            @info 'autostart disabled, waiting for start'

    start: ->
        @stopSeleniumPingbacks()
        @info "starting, uid: #{@uid}"
        @server.start()
        @_checkCapabilities()

        @client = new $selenium.webdriver.Builder()
                                .usingServer @server.address()
                                .withCapabilities @option('capabilities')
                                .build()

        if @isFullscreen()
            @fullscreen()

    ###
    Launches browser and opens provided URL
    ###
    # walk: (url) ->
    #     if @isVerbose()
    #         @info "pointed to '#{url}'"
    #     @_setContext @client.get(url)
    #     @

    ###
    Returns promise of current stored context if exists
    ###
    next: (cb) ->
        if @_context isnt undefined and @_context.then?
            @_context.then cb
        @

    ###
    @alias #walk
    ###
    # go: ->
    #     @walk arguments

    ###
    Waits desired time and executes callback
    ###
    # wait: (cb, time=1000) ->
    #     @_setContext @client.wait(cb, time)
    #     @

    ###
    Clicks at links, buttons etc.
    If `element` not passed as argument, uses one stored as this._context
    ###
    # click: (ele) ->
    #     @info "ordered to click on element"

    #     if not ele?
    #         @info "no element provided, using stored context"
    #         ctx = @_getContext()
    #         ctx.click()
    #     else
    #         @_setContext @_find(ele).click()
    #     @

    ###
    @todo
    ###
    submit: (id) ->
        throw (new $err.NotImplemented 'method not implemented')

    ###
    Returns current location
    ###
    location: (cb) ->
        if cb?
            return @client.getCurrentUrl()
                .then cb
        @client.getCurrentUrl()

    ###
    Checks if ele exists or not and executes callbacks
    Best use with Browser::wait()
    ###
    exists: (ele, cb) ->
        @info "checking if element '#{ele}' exists"
        if cb?
            return @client.isElementPresent(@_by(ele)).then (res) ->
                cb res
        @client.isElementPresent(@_by(ele))

    ###
    Waits for element to present
    ###
    waitFor: (ele, cb) ->
        @info "waiting for element '#{ele}' to appear"
        @client.wait =>
            @exists(ele).then (e) ->
                e
        , @option 'timeout'
        .then ->
            cb true
        .thenCatch =>
            @warn "called #waitFor for element, failed to locate one"
            cb false
        @

    ###
    Fills field with value
    ###
    fill: (field, value) ->
        @_find(field).then (ele) ->
            ele.clear()
            ele.sendKeys value
        @

    ###
    @todo instance methods
    ###
    url: ->
        @location arguments

    title: (cb) ->
        if cb?
            return @client.getTitle().then(cb)
        @_setContext @client.getTitle()
        @

    ###
    end of instance methods
    ###

    # sleep: (cb, time) ->
    #     time ?= @option 'timeout'
    #     @info "ordered to sleep for #{time}ms"
    #     @client.sleep(time).then =>
    #         @succ "was asleep for #{time}ms"
    #         cb() if cb?
    #     @

    screenshot: ->
        throw (new $err.NotImplemented 'method not implemented')

    # find: (sel)  ->
    #     @info "ordered to find element '#{sel}'"
    #     @_setContext @_find(sel)
    #     @

    # findByText: (text) ->
    #     @_setContext @_find(text, Browser.Matcher.by('partialLinkText'))
    #     @

    # link: (text) ->
    #     @info "ordered to find link containing text '#{text}'"
    #     @_setContext @_find(text, Browser.Matcher.by('partialLinkText'))
    #     @

    # reset: ->
    #     @info "performing session reset"
    #     options = new $selenium.webdriver.WebDriver.Options(@client)
    #     options.deleteAllCookies()
    #     @

    # fullscreen: ->
    #     @info "maximizing browser window"
    #     @manager().window().maximize()

    # quit: () ->
    #     if @client?
    #         _then = =>
    #             @info 'trying to stop selenium-server'
    #             @server.stop() if @server.stop?

    #         @client.quit().then _then


    setVerbose: (val) ->
        @option 'verbose', !!val

    isVerbose: ->
        !!@option 'verbose'

    isFullscreen: ->
        !!@option 'fullscreen'

    isSrvRunning: ->
        if @server?
            return @server.isRunning()
        false

    isAutostart: ->
        !!@option 'selenium.autostart'

    startSeleniumPingbacks: ->
        @_pingback = setInterval =>
            @info 'doing selenium-server life check'
            if @isSrvRunning()
                @succ 'selenium-server is alive and running'
            else
                @info 'looks like selenium-server stopped, restarting'
                @server.start()
        , 15000
        
    stopSeleniumPingbacks: ->
        clearInterval @_pingback    

    ###
    @internal
    ###

    _init: (config) ->
        @uid = util.uuid()
        @Matcher = new Matcher

        @
            ._initConfig(config)
            ._initLogger()
            ._initSelenium()
            
    _initConfig: (config) ->
        config = _.defaults config,
            browser: 'firefox'
            selenium: {}
            verbose: no
            timeout: 5000
            fullscreen: no    
        config.selenium = _.defaults config.selenium,
            autostart: yes   
            path: process.cwd()
            port: null

        @mergeOpts config
        @

    _initSelenium: ->
        @server = new $selenium @option('selenium.path'), @option('selenium.port'), {verbose: @option('verbose')}
        @succ 'configured selenium-server'

        @

    _initLogger: ->
        @logPrefix 'browser'
        @logCondition @option('verbose')
        @

    # _find: (ele, _by) ->
    #     @info "internal find method invoked, searching for element '#{ele}'"
    #     if _by?
    #         return @client.findElement _by(ele)
    #     @client.findElement @_by(ele)

    _by: (ele) ->
        console.log @Matcher.detect(ele)(@_cleanSelector(ele))
        @Matcher.detect(ele)(@_cleanSelector(ele))

    _checkCapabilities: ->
        _browser = @option 'browser' ? 'firefox'
        
        if @server.isCapable _browser
            @option 'browser', _browser
        else
            @option 'browser', 'firefox'

        @info "determined to be capable of '#{@option('browser')}'"

        @option 'capabilities', @server.getCapabilities(@option('browser'))

    _injectInstanceMethods: ->
        @manager = =>
            @client.manage()
        @logs = =>
            @manager().logs()

    # _getContext: ->
    #     @_context

    # _setContext: (c) ->
    #     @info 'noticed to change context'
    #     @_context = c
    #     @


    _cleanSelector: (sel) ->
        sel.replace /^[\#\.\>]/g, ''


Browser.useWdts = (suite) ->
    suite ?= require('selenium-webdriver/testing')
    [it, describe] = [suite.it, suite.describe]
    [it, describe]

module.exports = Browser
