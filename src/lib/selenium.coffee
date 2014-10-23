[util, cfg] = [
    require './util'
    require '../config.json'
]

###
Selenium modules
###
Selenium = util.merge {},
    webdriver: require 'selenium-webdriver'
    server: require('selenium-webdriver/remote').SeleniumServer
    portprober: require 'selenium-webdriver/net/portprober'
    #test: require 'selenium-webdriver/testing'

###
Configuration
###
util.extend Selenium,
    config: ->
        cfg?.selenium

    setup: (args) ->
        if isEmpty(args)
            args =
                path: Selenium.locate()
                port: Selenium.portprober.findFreePort()
                host: ''
        {@path, @host, @port} = args

        @configured = true
        @

    isCapable: (browser) ->
        @webdriver.Capabilities[browser]? and typeof @webdriver.Capabilities[browser] is 'function'

    getCapabilities: (browser) ->
        if @isCapable browser
            return @webdriver.Capabilities[browser]()
        {}


###
Extensions
###
ext = 
    locator: require './selenium/locator'
    updater: require './selenium/updater'

util.extend Selenium, ext.locator
util.extend Selenium, ext.updater
    
###
run/stop server
###
util.extend Selenium,
    running: no
    start: ->
        if not @configured
            @setup()

        @_server = new Selenium.server @path,
            port: @port
        @_server.start()
        @

    getInstance: ->
        @_server

    stop: ->
        if @isRunning()
            @_server.stop()
        @

    isRunning: ->
        if @_server?
            return @_server.isRunning()
        false



module.exports = Selenium
