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

# @TODO: CLEANUP!!1

###
@package Browser
###
class Browser extends util.Modules.Logger
    uid:      null
    client:   null
    server:   null

    @include BrowserContext
    @include util.Modules.Deferrable
    @include util.Modules.Promisable
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

    ###
    @var object Browser.Errors Collection of exception classes, provided by `common-errors` package
    ###
    Errors = $err

    ###
    @param string this.browser Name of browser that will be used
    @param object ext_opts Additional runtime options 
    ###
    constructor: (@browser = 'firefox', ext_opts = {}) ->
        super()

        @
            .validateOpts()
            ._init ext_opts

        if @isAutostart()
            @info 'autostart'
            @start()
        
            if not @isSrvRunning() and @isAutostart()
                throw new $err.Error 'Selenium server is not running'
        else
            @info 'autostart disabled, waiting for start'

    validateOpts: ->
        if not @browser? or not _.isString(@browser)
            @browser = 'firefox'
        @

    start: ->
        # @todo: Keep-alive Pingbacks - think about it
        # @stopSeleniumPingbacks()
        @info "starting, uid: #{@uid}"
        @server.start()
        #@_checkCapabilities()

        @client = new $selenium.webdriver.Builder()
                                .usingServer @server.address()
                                .withCapabilities @.option('browserCapabilities')
                                .setLoggingPrefs {browser: @.option('browserLog')}
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

    # then: (onFullfill, onRejected, onNotified) ->
    #     if @_context?
    #         @_context.then onFullfill, onRejected, onNotified
    #         #@_setContext 
    #     @


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

        @.obtainCapabilities()
            
    _initConfig: (config) ->
        config = _.defaults config,
            browserLog: 'SEVERE'
            verbose: no
            timeout: 5000
            fullscreen: no
            selenium: {}
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

    # _by: (ele) ->
    #     console.log @Matcher.detect(ele)(@_cleanSelector(ele))
    #     @Matcher.detect(ele)(@_cleanSelector(ele))
    obtainCapabilities: ->
        @browser = @option('browser') ? @browser

        capabilities = if @server.haveCapabilities @browser
            @server.getCapabilities @browser
        else
            # unless @server.haveBrowser @browser
            #     @browser = 'firefox'
            @server.defaultCapabilities()

        @option 'browserCapabilities', capabilities

    # _checkCapabilities: ->
    #     _browser = @option 'browser' ? 'firefox'
        
    #     if @server.isCapable _browser
    #         @option 'browser', _browser
    #     else
    #         @option 'browser', 'firefox'

    #     @info "determined to be capable of '#{@option('browser')}'"

    #     @option 'capabilities', @server.getCapabilities(@option('browser'))

    # _injectInstanceMethods: ->
    #     @manager = =>
    #         @client.manage()
    #     @logs = =>
    #         @manager().logs()

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
    [
        it
        describe
        before
        after
        beforeEach
        afterEach
    ] = [
        suite.it
        suite.describe
        suite.before
        suite.after
        suite.beforeEach
        suite.afterEach
    ]
    [it, describe, before, after, beforeEach, afterEach]

module.exports = Browser
