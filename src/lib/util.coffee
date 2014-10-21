[glob, path] = [
    require 'glob'
    require 'path'
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

exports.last = last = (array, back) -> array[array.length - (back or 0) - 1]

exports.first = first = (array) ->
    context = array ? this
    context[0]

Array::first   ?= first
Array::last    ?= last
Array::compact ?= compact

exports.error = (m) ->
    console.error "\u001b[1m\u001b[31mError!\u001b[39m\u001b[22m \u001b[1m#{m}\u001b[22m"

exports.info = (m) ->
    console.info "#{m}"

exports.warn = (m) ->
    console.warn "#{m}"

exports.succ = (m) ->
    console.log "\u001b[1m\u001b[32m#{m}\u001b[39m\u001b[22m"

exports.require_relative = (fi) ->
    _from = __dirname ? process.cwd()
    _req  = path.resolve _from, path.normalize(fi)
    require _req

exports.glob = extend exports, glob