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

    setup: ({@path, @host, @port}) ->
        unless @path?
            @path = @locate()
        unless @port?
            @port = @portprober.findFreePort()

        @configured = true
        @


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
    start: ({path, host, port}) ->
        if not @configured
            @setup()

        @server = new Selenium.server @path,
            port: @port
        @

    getInstance: ->
        @server

    stop: ->
        if @isRunning()
            @server.stop()
        @

    isRunning: ->
        if @server?
            return @server.isRunning()
        false



exports.Selenium = Selenium
