[glob, path, df] = [
    require 'glob'
    require 'path'
    require 'dateformat'
]

exports = module.exports if exports is undefined

exports.compact = compact = (array) ->
    context = array ? this
    item for item in context when item

exports.extend = extend = (obj, mixin) ->
    obj[name] = method for name, method of mixin
    obj

exports.include = include = (klass, mixin) ->
    extend klass.prototype, mixin

exports.merge = merge = (options, overrides) ->
    extend (extend {}, options), overrides

exports.last = last = (args...) ->
    if not isArray(args[0]) and isNum args[0]
        back = args[0]
    else if isArray args[0]
        array = args[0]
        back  = args[1] ? 0
    else
        back = 0

    context = array ? this 
    context[context.length - back - 1]

exports.first = first = (array) ->
    context = array ? this
    context[0]

Array::first   ?= first
Array::last    ?= last
Array::compact ?= compact

exports.put = put = (m, type = 'log') ->
    func = if typeof console[type] is 'function'
        console[type]
    else
        console.log

    func m

exports.prependTime = prependTime = (s, colorful = true) ->
    _formatted = df(new Date, "HH:MM:ss")
    
    if colorful
        _formatted = "\u001b[4m#{_formatted}\u001b[24m"

    _string = "#{_formatted}#{s}"

exports.error = (m, label = 'Error') ->
    put prependTime("\x20\u001b[1m\u001b[31m✖ #{label}:\u001b[39m\u001b[22m \u001b[1m#{m}\u001b[22m")

exports.info = (m, label = 'Notice') ->
    put prependTime("\x20\u001b[1m\u001b[34mℹ #{label}:\u001b[39m\u001b[22m #{m}")

exports.warn = (m, label = 'Warning') ->
    put prependTime("\x20\u001b[1m\u001b[33m⚠ #{label}:\u001b[39m\u001b[22m #{m}")

exports.succ = (m, label = '') ->
    put prependTime("\x20\u001b[1m\u001b[32m✔ #{label}\u001b[39m\u001b[22m #{m}")

exports.isArray = isArray = (_in) ->
    if Array.isArray isnt undefined
        Array.isArray _in
    else
        Object::toString.call(_in) is '[object Array]'

exports.isBool = isBool = (_in) ->
    _in is true or _in is false or Object::toString.call(_in) is '[object Boolean]'

exports.isNum = isNum = (_in) ->
    Object::toString.call(_in) is '[object Number]'

exports.isString = isString = (_in) ->
    Object::toString.call(_in) is '[object String]'

exports.isEmpty = isEmpty = (_in) ->
    return true if not _in?
    return _in.length is 0 if isArray(_in) or isString(_in)
    for key of _in  
        return false if Object::hasOwnProperty.call _in, key
    true


exports.flatout = (_in) ->
    if isArray _in
        for line in _in
            put line
    else
        put _in

exports.require_relative = (fi) ->
    _from = __dirname ? process.cwd()
    _req  = path.resolve _from, path.normalize(fi)
    require _req

exports.glob = extend exports, glob

globals = ['glob', 'put', 'isArray', 'isBool', 'isNum', 'isString', 'isEmpty', 'extend', 'include', 'merge']

for m in globals
    if global[m]? then global['_'+m] = global[m]
    global[m] = exports[m]

