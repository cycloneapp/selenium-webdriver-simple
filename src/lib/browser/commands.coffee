options = require('selenium-webdriver').WebDriver.Options
_       = require 'lodash'

BrowserCommands =
    walk: (url) ->
        @info "pointed to '#{url}'"
        @_setContext @client.get(url)

    go: ->
        @walk arguments

    reset: ->
        @info "performing session reset"

        _options = new options(@client)
        _options.deleteAllCookies()
        @

    ###
    Returns current location
    ###
    location: (cb) ->
        if cb?
            return @client.getCurrentUrl()
                .then cb
        @client.getCurrentUrl()

    fullscreen: ->
        @info "maximizing browser window"
        @manager().window().maximize()
        @

    # @todo: implement
    screenshot: ->
        throw (new $err.NotImplemented 'method not implemented')

    manager: ->
        @client.manage()

    logs: ->
        @manager().logs()

    errors: ->
        _defer = @defer()

        @logs().get('browser').then (logs) ->
            if logs.length > 0
                logs = _.pluck _.where(logs, {level: {name: 'SEVERE'}}), 'message'
                _defer.resolve logs
            else
                _defer.resolve []

        _defer.promise()

    quit: ->
        if @client?
            _then = =>
                @info 'trying to stop selenium-server'
                @server.stop() if @server.stop?

            @client.quit().then _then

    stop: ->
        if @client?
            @info 'stopping client'
            @reset()
            @client.quit().then =>
                @succ 'client stopped'

    sleep: (cb, time) ->
        time ?= @option 'timeout'
        @info "ordered to sleep for #{time}ms"
        @client.sleep(time).then =>
            @succ "was asleep for #{time}ms"
            cb() if cb?
        @

module.exports = BrowserCommands
