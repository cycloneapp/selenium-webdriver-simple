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

    haveBrowser: (browser) ->
        browser in @knownBrowsers

    haveCapabilities: (browser) ->
        Selenium.webdriver.Capabilities[browser]? and typeof Selenium.webdriver.Capabilities[browser] is 'function'

    defaultCapabilities: ->
        

    getCapabilities: (browser) ->
        if @haveCapabilities browser
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
        @info 'starting'

        @srv().start()
        @succ 'server started'

        @

    address: ->
        @srv().address()

    srv: (_srv) ->
        if _srv? 
            @_server = _srv
            return @
        @_server

    stop: ->
        @info 'stopping'

        if @isRunning()
            @srv().stop()
        else
            @warn 'already stopped?'

        @succ 'ordered to stop'
        @

    isRunning: ->
        if @_server?
            return @srv().isRunning()
        false

SeleniumVerbose =
    logNs: 'selenium-server'

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
class Selenium extends util.Modules.Logger
    @webdriver = require 'selenium-webdriver'
    @server = require('selenium-webdriver/remote').SeleniumServer
    @portprober = require 'selenium-webdriver/net/portprober'

    @include SeleniumConfiguration
    @include SeleniumJarLocator
    @include SeleniumRunner
    @include SeleniumVerbose

    knownBrowsers: do (browsers = @webdriver.Browser) ->
        _.values browsers

    constructor: (@path = "#{__dirname}/../vendor", @port = Selenium.portprober.findFreePort(), @ext_args = {}) ->
        super @logNs

        # @todo: change internals to use Configuration class
        if _.isEmpty(@path)
            extend @, path: "#{__dirname}/../vendor"
        else
            @path = $path.resolve @path
        if _.isEmpty(@port)
            extend @, port: Selenium.portprober.findFreePort()

        @jar = @locate()

        # @todo: move this to separate method
        if not _.isUndefined(@ext_args.numericalPort) and _.isBoolean(@ext_args.numericalPort)
            if 'then' of @port
                @port.then (p) =>
                    @port = p

        @logCondition @isVerbose()

        @configured = true


module.exports = Selenium
