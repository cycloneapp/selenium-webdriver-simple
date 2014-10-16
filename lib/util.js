var compact, exports, extend, first, glob, include, last, _base, _base1, _base2;

glob = [require('glob')][0];

if (exports === void 0) {
  exports = module.exports;
}

exports.compact = compact = function(array) {
  var context, item, _i, _len, _results;
  context = array != null ? array : this;
  _results = [];
  for (_i = 0, _len = context.length; _i < _len; _i++) {
    item = context[_i];
    if (item) {
      _results.push(item);
    }
  }
  return _results;
};

exports.extend = extend = function(obj, mixin) {
  var method, name;
  for (name in mixin) {
    method = mixin[name];
    obj[name] = method;
  }
  return obj;
};

exports.include = include = function(klass, mixin) {
  return extend(klass.prototype, mixin);
};

exports.merge = function(options, overrides) {
  return extend(extend({}, options), overrides);
};

exports.last = last = function(array, back) {
  return array[array.length - (back || 0) - 1];
};

exports.first = first = function(array) {
  return array[0];
};

if ((_base = Array.prototype).first == null) {
  _base.first = first;
}

if ((_base1 = Array.prototype).last == null) {
  _base1.last = last;
}

if ((_base2 = Array.prototype).compact == null) {
  _base2.compact = compact;
}

exports.glob = extend(exports, glob);
