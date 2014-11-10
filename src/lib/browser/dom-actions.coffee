DOMActions =
    find: (sel) ->
        @_find sel

    # @todo: implement
    findAll: (sel) ->
        throw (new $err.NotImplemented 'method not implemented')

    # @todo: implement
    findByName: (name) ->
        throw (new $err.NotImplemented 'method not implemented')

    # @todo: implement
    findByText: (text) ->
        throw (new $err.NotImplemented 'method not implemented')

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

    click: (ele) ->
        @_setContext @_resolveElement(ele).click()

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

    _find: (ele, _by) ->
        _ele = if _by?
            @client.findElement _by(ele)
        else
            @client.findElement @_by(ele)
        @_setContext _ele

    _by: (sel) ->
        console.log @Matcher.detect(ele)(@_cleanSelector(sel))
        @Matcher.detect(ele)(@_cleanSelector(sel))

    # @todo: Fix it more properly, possibly move method to Browser.Matcher and do cleanup only on `name` case
    _cleanSelector: (sel) ->
        sel.replace /^[\#\.\>]/g, ''

    _resolveElement: (ele) ->
        if ele?
            @_find ele
        else
            @_getContext()    

module.exports = DOMActions
