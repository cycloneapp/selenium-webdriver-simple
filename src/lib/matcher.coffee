[util, wd] = [
    require './util'
    require('./selenium').webdriver
]

Matcher =
    types: {
        'id': /^\#[\w\-]+$/
        'class': /\s*\.[\w\-]+$/
        'cssQuery': /[\w\-\s\*\>\[\]\:\.]+/
        'name': /^[\w\-]+$/
        'headTags': /^html|head|meta|link|title|body$/
    }

    tags: ["a","abbr","acronym",
        "address","applet","area",
        "article","aside","audio",
        "b","base","basefont","bdi",
        "bdo","bgsound","blockquote",
        "big","body","blink","br",
        "button","canvas","caption",
        "center","cite","code","col",
        "colgroup","command","comment",
        "datalist","dd","del","details",
        "dfn","dir","div","dl","dt","em",
        "embed","fieldset","figcaption",
        "figure","font","form","footer",
        "frame","frameset","h1","h2","h3",
        "h4","h5","h6","head","header",
        "hgroup","hr","html","i","iframe",
        "img","input","ins","isindex","kbd",
        "keygen","label","legend","li","link",
        "main","map","marquee","mark","menu",
        "meta","meter","nav","nobr","noembed",
        "noframes","noscript","object","ol",
        "optgroup","option","output","p","param",
        "plaintext","pre","progress","q","rp",
        "rt","ruby","s","samp","script","section",
        "select","small","span","source","strike",
        "strong","style","sub","summary","sup","table",
        "tbody","td","textarea","tfoot","th","thead",
        "time","title","tr","tt","u","ul","var","video",
        "wbr","xmp"]

    detect: (_s) ->
        type = switch true
            when @_testForTag _s then 'tag'
            when @_testForClass _s then 'css'
            when @_testForId _s then 'id'
            when @_testForName _s then 'name'
            when @_testForCssQuery _s then 'cssQuery'
            else false

        switch type
            when 'tag' then wd.By.tagName
            when 'id' then wd.By.id
            when 'css' then wd.By.css
            when 'cssQuery' then wd.By.css
            else wd.By.name

    by: (type) ->
        type ?= 'id'
        if wd.By[type] isnt undefined
            wd.By[type]
        else
            wd.By.id

    is: (_s, type = 'id') ->
        if @types[type]?
            return @types[type].test _s
        false

    _testForId: (el) ->
        @types.id.test el

    _testForClass: (el) ->
        @types.class.test el

    _testForTag: (el) ->
        if @types.headTags.test el
            return true 
        else
            el in @tags

    _testForName: (el) ->
        @types.name.test el

    _testForCssQuery: (el) ->
        @types.cssQuery.test el

module.exports = Matcher
