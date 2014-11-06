DOMActions =
    find: (sel) ->

    findAll: (sel) ->

    findByName: (name) ->

    findByText: (text) ->

    link: (query) ->

    button: (sel) ->

    form: (sel) ->
        

    css: (query) ->

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

    _find: (ele) ->

    _by: (ele) ->

    _resolveElement: (ele) ->
        if ele?
            @_find ele
        else
            @_getContext()    

module.exports = DOMActions
