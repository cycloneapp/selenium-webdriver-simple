selenium = require('./selenium').Selenium

class Browser
    @verbose = no
    constructor: (selenium) ->
        @server = selenium.startServer().getServer()

        @client = new selenium.webdriver.Builder()
                        .usingServer @server.address()
                        .withCapabilities @_determineCapabilities()
                        .build()

    walk: (url) ->
        @client.get url
        @

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


    find: (sel)  ->
        @client.findElement sel
        @

    title: (cb) ->
        @client.getTitle().then(cb)
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

