DOMActions =
    find: (sel) ->
        @_find sel

    # @todo: implement
    findAll: (sel) ->
        throw (new $err.NotImplemented 'method not implemented')

    # @todo: implement
    findByName: (name) ->
        @_find "[name=#{name}]", @Matcher.by('css')

    # @todo: implement
    findByText: (text) ->
        @_find text, @Matcher.by('partialText')

    link: (query) ->
        @_find query

    linkByText: (text) ->
        @_find text, @Matcher.by('partialLinkText')

    # @todo: implement
    button: (sel) ->
        throw (new $err.NotImplemented 'method not implemented')

    # @todo: implement
    form: (sel) ->
        throw (new $err.NotImplemented 'method not implemented')
    
    # @todo: implement
    css: (query) ->
        throw (new $err.NotImplemented 'method not implemented')

    submit: (ele) ->
        @_setContext @_resolveElement(ele).submit()

    ###
    Clicks at links, buttons etc.
    If `element` not passed as argument, uses one stored as this._context
    ###
    click: (ele) ->
        @_setContext @_resolveElement(ele).click()

    ###
    Fills field with value
    ###
    fill: (args...) ->
        [ele, val] = args

        if not val?
            # only value provided, using stored context
            [val, ele] = [ele, @_getContext()]
        else if val? and ele?
            # both element and value provided
            ele = @_resolveElement ele

        if ele?
            @_setContext ele.sendKeys(val)

    ###
    Checks if ele exists or not and executes callbacks
    Best use with Browser::wait()
    ###
    exists: (ele, cb) ->
        @info "checking if element '#{ele}' exists"
        if cb?
            return @client.isElementPresent(@_by(ele)).then (res) ->
                cb res
        @client.isElementPresent(@_by(ele))

    ###
    Waits for element to present
    ###
    waitFor: (ele, cb) ->
        @info "waiting for element '#{ele}' to appear"
        @client.wait =>
            @exists(ele).then (e) ->
                e
        , @option 'timeout'
        .then ->
            cb true
        .thenCatch =>
            @warn "called #waitFor for element, failed to locate one"
            cb false
        @

    title: (cb) ->
        if cb?
            return @client.getTitle().then(cb)
        @_setContext @client.getTitle()

    _find: (ele, _by) ->
        _ele = if _by?
            @client.findElement _by(ele)
        else
            @client.findElement @_by(ele)
        @_setContext _ele

    _by: (sel) ->
        @debug @Matcher.detect(sel)(@_cleanSelector(sel))
        @Matcher.detect(sel)(@_cleanSelector(sel))

    # @todo: Fix it more properly, possibly move method to Browser.Matcher and do cleanup only on `name` case
    _cleanSelector: (sel) ->
        sel.replace /^[\#\.\>]/g, ''

    _resolveElement: (ele) ->
        if ele?
            @_find ele
        else
            @_getContext()    

module.exports = DOMActions
