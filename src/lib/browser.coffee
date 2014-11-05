[   
    $err
    $selenium
    util
    $match
] = [
    require 'common-errors'
    require './selenium'
    require './util'
    require './matcher'
]

class Browser
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

    constructor: (@config) ->
        if _.isEmpty(@config) or _.isUndefined(@config)
            @config = {}

        @config = _.defaults @config,
            browser: 'firefox'
            selenium:   
                path: process.cwd()
                port: null
            verbose: no
            timeout: 5000
            fullscreen: no
            
        {@browser, selenium, @verbose, @timeout} = @config

        if @verbose
            util.info 'starting selenium-server', 'browser'

        @server = new $selenium selenium.path, selenium.port, {verbose: @verbose}
        @server.start()
        
        unless @server.isRunning()
            throw new $err.Error 'Selenium server is not running'

        @_checkCapabilities()

        @client = new $selenium.webdriver.Builder()
                        .usingServer @server.address()
                        .withCapabilities @capabilities
                        .build()

        @_injectInstanceMethods()

        if @isFullscreen()
            @fullscreen()

    ###
    Launches browser and opens provided URL
    ###
    walk: (url) ->
        if @isVerbose()
            util.info "pointed to '#{url}'", 'browser'
        @_setContext @client.get(url)
        @

    ###
    Returns promise of current stored context if exists
    ###
    next: (cb) ->
        if @_context isnt undefined and @_context.then?
            @_context.then cb
        @

    ###
    @alias Browser::walk
    ###
    go: ->
        @walk arguments

    ###
    Waits desired time and executes callback
    ###
    wait: (cb, time=1000) ->
        @_setContext @client.wait(cb, time)
        @

    ###
    Clicks at links, buttons etc.
    If `element` not passed as argument, uses one stored as this._context
    ###
    click: (ele) ->
        if not ele?
            ctx = @_getContext()
            ctx.click()
        else
            @_setContext @_find(ele).click()
        @

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
    exists: (ele, cb = (-> true), ecb = (-> false)) ->
        if cb? or ecb?
            return @client.isElementPresent(@_by(ele)).then cb, ecb
        @client.isElementPresent(@_by(ele))

    ###
    Waits for element to present
    @notice WIP!
    ###
    waitFor: (ele, scb, ecb) ->
        tries = 0
        periodical = setInterval =>
            _e = @client.isElementPresent ele
            if _e
                scb()
                clearInterval periodical
            else
                if tries < 5
                    tries = tries+1
                else
                    ecb()

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
            @client.getTitle().then(cb)
        else
            @_setContext @client.getTitle()
            @

    ###
    end of instance methods
    ###

    sleep: (time) ->
        time ?= @timeout
        @wait ->
            util.succ "was asleep for #{time}ms"
        , time

    screenshot: ->
        throw (new $err.NotImplemented 'method not implemented')

    find: (sel)  ->
        @_setContext @_find(sel)
        @

    findByText: (text) ->
        @_setContext @_find(text, $match.by('partialLinkText'))
        @

    reset: ->
        options = new $selenium.webdriver.WebDriver.Options(@client)
        options.deleteAllCookies()
        @

    fullscreen: ->
        @manager().window().maximize()

    quit: () ->
        if @client?
            _then = =>
                util.info 'trying to stop selenium-server', 'browser' if @isVerbose()
                @server.stop() if @server.stop?

            @client.quit().then _then


    setVerbose: (val) ->
        @verbose = val

    isVerbose: ->
        if @verbose? and @verbose then yes else no

    isFullscreen: ->
        if @config.fullscreen?
            !!@config.fullscreen

    ###
    @internal
    ###

    _find: (ele, _by) ->
        if _by?
            return @client.findElement _by(ele)
        @client.findElement @_by(ele)

    _by: (ele) ->
        $match.detect(ele)(@_cleanSelector(ele))

    _checkCapabilities: ->
        _browser = if @config? and @config.browser? and not isEmpty(@config.browser)
            @config.browser
        else
            'firefox'
        
        if @server.isCapable _browser
            @browser = _browser
        else
            @browser = 'firefox'

        if @isVerbose()
            util.info "determined to be capable of '#{@browser}'", 'browser'

        @capabilities = @server.getCapabilities @browser

    _injectInstanceMethods: ->
        @manager = =>
            @client.manage()
        @logs = =>
            @manager().logs()

    _getContext: ->
        @_context

    _setContext: (c) ->
        if @isVerbose()
            util.info 'noticed to change context', 'browser'
        @_context = c
        @

    _cleanSelector: (sel) ->
        sel.replace /[\#\.\>]/g, ''


Browser.useWdts = (suite) ->
    suite ?= require('selenium-webdriver/testing')
    [it, describe] = [suite.it, suite.describe]
    [it, describe]

module.exports = Browser
