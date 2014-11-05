[util, $path] = [
    require './util'
    require 'path'
]


###
Configuration
###
SeleniumConfiguration =
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
        Selenium.webdriver.Capabilities[browser]? and typeof Selenium.webdriver.Capabilities[browser] is 'function'

    getCapabilities: (browser) ->
        if @isCapable browser
            return Selenium.webdriver.Capabilities[browser]()
        {}

    
###
run/stop server
###
SeleniumRunner =
    running: no
    start: ->
        if not @configured
            @setup()

        @srv new Selenium.server @jar,
            port: @port

        if @isVerbose()
            @info 'starting'

        @srv().start()

        if @isVerbose()
            @succ 'server started' if @isRunning()

        @

    address: ->
        @srv().address()

    srv: (_srv) ->
        if _srv? 
            @_server = _srv
            return @
        @_server

    stop: ->
        if @isVerbose()
            @succ 'scheduled to stop'
        if @isRunning()
            @srv().stop()
        else
            @warn 'already stopped?' if @isVerbose()
        @

    isRunning: ->
        if @_server?
            return @srv().isRunning()
        false

SeleniumLogger =
    logNs: 'selenium-server'

    log: (msg) ->
        console.log msg, @logNs

    error: (msg) ->
        util.error msg, @logNs

    info: (msg) ->
        util.info msg, @logNs

    succ: (msg) ->
        util.succ msg, @logNs

    isVerbose: ->
        if @ext_args isnt undefined and not _.isUndefined(@ext_args.verbose)
            !!@ext_args.verbose
        else
            false

    setVerbose: (val) ->
        @ext_args.verbose = !!val


SeleniumJarLocator = require './selenium/locator'

###
Selenium modules
###
class Selenium extends util.Module
    @webdriver = require 'selenium-webdriver'
    @server = require('selenium-webdriver/remote').SeleniumServer
    @portprober = require 'selenium-webdriver/net/portprober'

    @include SeleniumConfiguration
    @include SeleniumJarLocator
    @include SeleniumRunner
    @include SeleniumLogger

    constructor: (@path = "#{__dirname}/../vendor", @port = Selenium.portprober.findFreePort(), @ext_args = {}) ->

        if _.isEmpty(@path)
            extend @, path: "#{__dirname}/../vendor"
        else
            @path = $path.resolve @path
        if _.isEmpty(@port)
            extend @, port: Selenium.portprober.findFreePort()

        @jar = @locate()

        if not _.isUndefined(@ext_args.numericalPort) and _.isBoolean(@ext_args.numericalPort)
            if 'then' of @port
                @port.then (p) =>
                    @port = p

        @configured = true


module.exports = Selenium
