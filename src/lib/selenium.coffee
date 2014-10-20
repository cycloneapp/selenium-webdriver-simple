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
    startServer: ->
        @server = new Selenium.server @locate(),
            port: @portprober.findFreePort()
        @running = yes
        @

    getServer: ->
        @server

    stopServer: ->
        if @running
            @server.stop()
        @

    isRunning: ->
        @running



exports.Selenium = Selenium