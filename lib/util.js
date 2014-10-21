(function() {
  var compact, exports, extend, first, glob, include, last, merge, path, _base, _base1, _base2, _ref;

  _ref = [require('glob'), require('path')], glob = _ref[0], path = _ref[1];

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

  exports.merge = merge = function(options, overrides) {
    return extend(extend({}, options), overrides);
  };

  exports.last = last = function(array, back) {
    return array[array.length - (back || 0) - 1];
  };

  exports.first = first = function(array) {
    var context;
    context = array != null ? array : this;
    return context[0];
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

  exports.error = function(m) {
    return console.error("\u001b[1m\u001b[31mError!\u001b[39m\u001b[22m \u001b[1m" + m + "\u001b[22m");
  };

  exports.info = function(m) {
    return console.info("" + m);
  };

  exports.warn = function(m) {
    return console.warn("" + m);
  };

  exports.succ = function(m) {
    return console.log("\u001b[1m\u001b[32m" + m + "\u001b[39m\u001b[22m");
  };

  exports.require_relative = function(fi) {
    var _from, _req;
    _from = typeof __dirname !== "undefined" && __dirname !== null ? __dirname : process.cwd();
    _req = path.resolve(_from, path.normalize(fi));
    return require(_req);
  };

  exports.glob = extend(exports, glob);

}).call(this);
