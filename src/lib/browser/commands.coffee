BrowserCommands =
    walk: (url) ->
        @info "pointed to '#{url}'"
        @_setContext @client.get(url)
        @

    go: ->
        @walk arguments

    reset: ->
        @info "performing session reset"
        options = new $selenium.webdriver.WebDriver.Options(@client)
        options.deleteAllCookies()
        @

    fullscreen: ->
        @info "maximizing browser window"
        @manager().window().maximize()

    manager: ->
        @client.manage()

    logs: ->
        @manager.logs()

    quit: ->
        if @client?
            _then = =>
                @info 'trying to stop selenium-server'
                @server.stop() if @server.stop?

            @client.quit().then _then

    sleep: (cb, time) ->
        time ?= @option 'timeout'
        @info "ordered to sleep for #{time}ms"
        @client.sleep(time).then =>
            @succ "was asleep for #{time}ms"
            cb() if cb?
        @

module.exports = BrowserCommands
