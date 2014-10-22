$selenium = require('./selenium')

class Browser
    @verbose = no
    constructor: (@config) ->
        {browser, selenium, @verbose, @timeout} = @config\

        $selenium.setup selenium
        
        @server = selenium.startServer().getServer()
        unless @t?
            log 'test'
        @client = new selenium.webdriver.Builder()
                        .usingServer @server.address()
                        .withCapabilities @_determineCapabilities()
                        .build()

    walk: (url) ->
        @client.get url
        @

    go: ->
        @walk arguments

    wait: (cb, time=1000) ->
        @client.wait(cb, time)
        @

    click: (ele) ->
        @_find(ele).click()
        @

    submit: (id) ->
        @_

    waitFor: ->
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
        @

    title: (cb) ->
        @client.getTitle().then(cb)
        @

    ###
    end of instance methods
    ###

    sleep: ->
        @

    screenshot: ->

    find: (sel)  ->
        @client.findElement sel
        @



    reset: ->
        options = new selenium.webdriver.WebDriver.Options(@client)
        options.deleteAllCookies()

    quit: () ->
        if @client?
            @client.quit()
        if @server? and @server.isRunning()
            @server.stopServer()

    setVerbose: (val) ->
        @verbose = val

    isVerbose: ->
        if @verbose? and @verbose then yes else no

    _find: (ele) ->
        @client.findElement ele

    _determineCapabilities: (selenium) ->
        if selenium? and selenium.config()?
            _browser = selenium.config().browser
        else
            _browser = 'firefox'
        @browser = _browser
        @browser

exports = Browser
