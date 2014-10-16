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
    test: require 'selenium-webdriver/testing'

###
Configuration
###
util.extend Selenium,
    config: ->
        cfg?.selenium

###
Extensions
###
util.extend Selenium,
    locator: require 'selenium/locator'
    updater: require 'selenium/updater'


exports.Selenium = Selenium