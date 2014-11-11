[
    glob
    path
    df
    vow 
    _
] = [
    require 'glob'
    require 'path'
    require 'dateformat'
    require 'vow'
    require 'lodash'
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

###
@todo Replace with Lodash methods
###
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

exports.put = put = (m, ext_args...) ->
    [type, timestamps] = ext_args
    type ?= 'log'
    timestamps ?= false
    func = if typeof console[type] is 'function'
        console[type]
    else
        console.log

    if timestamps
        m = prependTime m

    func m

exports.prependTime = prependTime = (s, colorful = true) ->
    _formatted = df(new Date, "HH:MM:ss")
    
    if colorful
        _formatted = "\u001b[4m#{_formatted}\u001b[24m"

    _string = "#{_formatted}#{s}"

__label = (l) ->
    "\x1b[;38;5;31m\u001b[1m#{l}\u001b[22m\x1b[0m"

exports.error = _error = (m, label = 'Error') ->
    put "\x20#{__label(label)}\x20\u001b[31m\u001b[1merror\u001b[39m\u001b[22m\x20#{m}", 'log'

exports.info = _info = (m, label = 'Notice') ->
    put "\x20#{__label(label)}\x20\u001b[34m\u001b[1minfo\u001b[39m\u001b[22m\x20#{m}"

exports.warn = _warn = (m, label = '') ->
    put "\x20#{__label(label)}\x20\u001b[33m\u001b[1mwarning\u001b[39m\u001b[22m\x20#{m}", 'log'
    #put "\x20\u001b[33m⚠ \u001b[1m#{label}\u001b[39m\u001b[22m #{m}", 'log', true

exports.succ = _succ = (m, label = '') ->
    put "\x20#{__label(label)}\x20\u001b[32m\u001b[1msuccess\u001b[39m\u001b[22m\x20#{m}"

exports.debug = _debug = (m, label = '') ->
    put "\x20#{__label(label)}\x20\u001b[35m\u001b[1mdebug\u001b[39m\u001b[22m\x20#{m}"

exports.log = _log = (m, label = '') ->
    put "\x20#{label}\x20#{m}"

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
    return false if isBool(_in)
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

exports.uuid = ->
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace /[xy]/g, (c) ->
        r = Math.random() * 16 | 0
        v = if c is 'x' then r else (r & 0x3 | 0x8)
        v.toString 16

exports.glob = extend exports, glob

exports.Module = class Module
    @extend: (obj) ->
        for key, value of obj when key not in ['extended', 'included']
            @[key] = value

        obj.extended?.apply(@)
        @

    @include: (obj) ->
        for key, value of obj when key not in ['extended', 'included']
            @::[key] = value

        obj.included?.apply(@)
        @

exports.Modules = {}

###
@todo Make it class
###
exports.Modules.Configuration = class Configuration extends Module
    constructor: ->
        @opts = {}

    mergeOpts: (opts) ->
        @opts = _.assign @opts, opts

    option: (opt, val) ->
        if /\./g.test(opt)
            _opt = @_recursiveOpt opt
            _opt
        else
            if val?
                @opts[opt] = val
                
            if @hasOpt(opt)
                @opts[opt]

    hasOpt: (opt) ->
        @opts[opt] isnt undefined

    _recursiveOpt: (opt) ->
        pieces = opt.split '.'
        [_key, _val] = [_.last(pieces), @opts]

        for piece in _.initial(pieces)
            if _val[piece]?
                _val = _val[piece]

        if _val? and _val[_key]?
            _val[_key]

    config: ->
        @opts

exports.Modules.Logger = class Logger extends Configuration
    constructor: (prefix) ->
        super()
        @log_opts =
            prefix: 'logger'
            condition: false

        @logPrefix prefix if prefix?

    logCondition: (condition) ->
        if condition?
            @log_opts?.condition = !!condition

        !!@log_opts.condition

    logPrefix: (prefix) ->
        if prefix?
            if not _.isString(prefix)
                prefix = Object::toString.call prefix
            @log_opts?.prefix = prefix

        @log_opts.prefix

    log: (msg) ->
        if @logCondition()
            _log msg, @logPrefix()

    succ: (msg) ->
        if @logCondition()
            _succ msg, @logPrefix()

    error: (msg) ->
        if @logCondition()
            _error msg, @logPrefix()

    info: (msg) ->
        if @logCondition()
            _info msg, @logPrefix()

    warn: (msg) ->
        if @logCondition()
            _warn msg, @logPrefix()

    debug: (msg) ->
        _debug msg, @logPrefix()


exports.Modules.Deferred =
    defer: ->
        new vow.Deferred()

globals = ['glob', 'put', 'isArray', 'isBool', 'isNum', 'isString', 'isEmpty', 'extend', 'include', 'merge']

for m in globals
    if global[m]? then global['_'+m] = global[m]
    global[m] = exports[m]

# Lodash
global['_'] = _
