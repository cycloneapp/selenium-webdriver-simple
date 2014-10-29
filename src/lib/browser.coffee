[$selenium, $err, util, $match] = [
    require './selenium'
    require 'common-errors'
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
        if isEmpty(@config)
            @config =
                browser: ''
                selenium: ''
                verbose: no
                timeout: 5000
        {@browser, selenium, @verbose, @timeout} = @config

        if @verbose
            util.info 'starting selenium-server', 'browser'

        $selenium
            .setup selenium
            .start()
        
        unless $selenium.isRunning()
            throw new $err.Error 'Selenium server is not running'
        else
            util.succ 'selenium-server started', 'browser'

        @_checkCapabilities()
            
        @server = $selenium.getInstance()

        @client = new $selenium.webdriver.Builder()
                        .usingServer @server.address()
                        .withCapabilities @capabilities
                        .build()

        @_injectInstanceMethods()

    walk: (url) ->
        @_setContext @client.get(url)
        @

    ###
    Returns promise of current stored context if exists
    ###
    next: (cb) ->
        if @_context isnt undefined and @_context.then?
            @_context.then cb
        @

    go: ->
        @walk arguments

    wait: (cb, time=1000) ->
        @_setContext @client.wait(cb, time)
        @

    click: (ele) ->
        @_setContext @_find(ele).click()
        @

    submit: (id) ->
        @

    location: (cb) ->
        if cb?
            return @client.getCurrentUrl()
                .then cb
        @client.getCurrentUrl()

    exists: (ele) ->
        @client.isElementPresent(@_by(ele))

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
        @client.getTitle().then(cb)
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

    reset: ->
        options = new $selenium.webdriver.WebDriver.Options(@client)
        options.deleteAllCookies()
        @

    quit: () ->
        if @client?
            @client.quit()
        if @server? and @server.isRunning()
            @server.stop()

    setVerbose: (val) ->
        @verbose = val

    isVerbose: ->
        if @verbose? and @verbose then yes else no

    ###
    @internal
    ###

    _find: (ele) ->
        @client.findElement @_by(ele)

    _by: (ele) ->
        $match.detect(ele)(@_cleanSelector(ele))
        # console.log sel
        # sel

    _checkCapabilities: ->
        _browser = if @config? and @config.browser? and not isEmpty(@config.browser)
            @config.browser
        else
            'firefox'
        
        if $selenium.isCapable _browser
            @browser = _browser
        else
            @browser = 'firefox'

        @capabilities = $selenium.getCapabilities @browser

    _injectInstanceMethods: ->
        @manager = =>
            @client.manage()
        @logs = =>
            @manager().logs()

    _getContext: ->
        @_context

    _setContext: (c) ->
        @_context = c
        @

    _cleanSelector: (sel) ->
        sel.replace /[\#\.\>]/g, ''


Browser.useWdts = (suite) ->
    suite ?= require('selenium-webdriver/testing')
    [it, describe] = [suite.it, suite.describe]
    [it, describe]

module.exports = Browser
