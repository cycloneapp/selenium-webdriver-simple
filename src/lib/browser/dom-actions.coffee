DOMActions =
    ElementMethods: [
        'clear',
        'click',
        'findElement',
        'findElements',
        'getAttribute',
        'getCssValue',
        'getDriver',
        'getId',
        'getInnerHtml',
        'getLocation',
        'getOuterHtml',
        'getSize',
        'getTagName',
        'getText',
        'isDisplayed',
        'isElementPresent',
        'isEnabled',
        'isSelected',
        'schedule_',
        'sendKeys',
        'submit' 
    ]

    find: (sel) ->
        @_find sel
        #@

    # @todo: implement
    findAll: (sel) ->
        throw (new $err.NotImplemented 'method not implemented')

    findByName: (name) ->
        @_find "[name=#{name}]", @Matcher.by('css')

    findById: (id) ->
        @_find id, @Matcher.by('id')

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
        @_resolveElement(ele).submit()

    id: (ele) ->
        @.attr ele, 'id'
    
    # @todo: implement
    innerHTML: (ele) ->

    # @todo: implement
    outerHTML: (ele) ->

    # @todo: implement
    text: (ele) ->
        _defer = @.defer()
        @_resolveElement(ele).then (e) =>
            e.getText()
                .then (t) ->
                    _defer.resolve t
                .thenCatch (e) ->
                    _defer.reject e
        _defer.promise()

    ###
    @notice Not chainable!
    ###
    enabled: (ele) ->
        @._resolveBool ele, 'isEnabled'

    ###
    @alias #visible
    ###
    displayed: (ele) ->
        @.visible ele

    ###
    @notice Not chainable!
    @summary [covered]
    ###
    visible: (ele) ->
        @._resolveBool ele, 'isDisplayed'

    ###
    @description Get element attribute
    @param {string} [ele] Element selector to lookup
    @param {string} attr Attribute to get
    @summary [covered]
    @returns Promise
    ###
    attr: (ele, attr) ->
        if not attr? and ele?
            # Element not specified, but attr was
            [ele, attr] = [attr, ele]

        _defer = @.defer()
        @_resolveElement(ele).then (e) ->
            e.getAttribute(attr)
                .then (v) ->
                    _defer.resolve v
                .thenCatch (e) ->
                    _defer.reject e
        _defer.promise()

    # @todo: implement
    cssValue: (ele, option) ->

    ###
    @description Clears the input text from element
    @returns this
    @notice It 'reloads' context, meaning it leave context belonging to the same element, but reassing variable
    @summary [chainable, covered]
    ###
    clear: (ele) ->
        @_resolveElement(ele).then (e) =>
            @._wrapPromise e.clear()
        @

    ###
    @description Clicks at links, buttons etc. If `element` not passed as argument, uses one stored as this._context
    @returns this
    @summary [chainable, covered]
    ###
    click: (ele) ->
        _ele = @_resolveElement ele
        #console.log _ele.click

        if @.isPromise _ele
            @debug "click: got promise"
            _ele.then (e) =>
                @._setContext e.click()
                @._adoptPromise @._context, yes
                #console.log @._promise
            , (err) =>
                @error err
        @


    ###
    @description Fills field with value
    @notice This method does not changes context!
    @returns this
    @summary [chainable, covered]
    ###
    fill: (args...) ->
        [ele, val] = args

        if not val?
            # only value provided, using stored context
            [val, ele] = [ele, @._resolveElement()]
        else if val? and ele?
            # both element and value provided
            ele = @_resolveElement ele

        if ele?
            if @.isPromise ele
                #@._setContext ele.then (_e) ->
                ele.then (_e) =>
                    @._adoptPromise _e.sendKeys val
                #, =>
                #    @._adoptPromise @._reject "failed to resolve element for #fill, perharps element not exist?"

            else 
                #@_setContext ele.sendKeys(val)
                @._adoptPromise ele.sendKeys(val)

            #@._adoptPromise @._context, yes
        else
            @._adoptPromise @._reject "no element resolved for #fill"
        @

    ###
    @descriprion Checks if ele exists or not and executes callbacks. Best use with Browser::wait()
    @returns this
    @summary [chainable, covered]
    ###
    exists: (ele) ->
        @info "checking if element '#{ele}' exists"
        @._wrapPromise @client.isElementPresent(@_by(ele))

    ###
    Waits for element to present
    @todo: rewrite
    @returns this
    @summary [chainable, covered]
    ###
    waitFor: (ele, cb) ->
        @info "waiting for element '#{ele}' to appear"

        @._setContext(@client.wait =>
            @exists(ele).then (e) ->
                e       
        , @option 'timeout'
        .then (e) =>
            @._adoptPromise @._fulfill true
            cb true if cb?
        .thenCatch =>
            @._adoptPromise @._reject "called #waitFor for element, failed to locate one"
            @warn "called #waitFor for element, failed to locate one"
            cb false if cb?
        )
        
    ###
    @returns this
    @summary [chainable]
    ###
    title: (cb) ->
        @._wrapPromise @client.getTitle()

    ###
    @returns this
    @summary [chainable]
    ###
    _find: (ele, _by) ->
        @debug "searching for element '#{ele}'"
        _by = if _by? then _by(ele) else @._by(ele)
        
        @._setContext(
            @client.findElement(_by)
                .then (e) =>
                    @._adoptPromise @._fulfill e
                .thenCatch =>
                    @._adoptPromise @._reject "Element '#{ele}' not found"
        )

    ###
    @returns webdriver.By
    ###
    _by: (sel) ->
        @.debug @Matcher.detect(sel)(@._cleanSelector(sel))
        @Matcher.detect(sel)(@_cleanSelector(sel))

    # @todo: Fix it more properly, possibly move method to Browser.Matcher and do cleanup only on `name` case
    _cleanSelector: (sel) ->
        sel.replace /^[\#\.\>]/g, ''

    # _resolveElement: (ele) ->
    #     if ele?
    #         @._find ele
    #     else
    #         @._getContext()    

    # @todo: rewrite, possible memory leak
    ###
    @returns this|this._context
    @summary [chainable]
    ###
    _resolveElement: (ele) ->
        @debug "resolving element '#{ele}'"
        unless ele?
            if @._context?
                @debug "resolve: picking internal context as element"
                ele = @._context
            else
                return @._reject "Cannot resolve element without element selector"
        else
            @debug "resolve: looking for element using _find()"
            ele = @._find ele

        ele

    ###
    @returns Promise
    ###
    _resolveBool: (ele, fn) ->
        _defer = @.defer()
        @._resolveElement(ele).then (e) =>
            e[fn]().then (e) ->
                _defer.resolve(e) if _.isBoolean e
            , ->
                _defer.reject()
        _defer.promise()




module.exports = DOMActions
