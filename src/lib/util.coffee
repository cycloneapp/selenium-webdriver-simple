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

exports.merge = (options, overrides) ->
    extend (extend {}, options), overrides

exports.last = last = (array, back) -> array[array.length - (back or 0) - 1]

exports.first = first = (array) -> array[0]

Array::first   ?= first
Array::last    ?= last
Array::compact ?= compact

exports.require_relative = (fi) ->
    _from = __dirname ? process.cwd()
    _req  = path.resolve _from, path.normalize(fi)
    require _req

exports.glob = extend exports, glob