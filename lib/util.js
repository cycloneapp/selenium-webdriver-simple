(function() {
  var Module, compact, df, exports, extend, first, glob, globals, include, isArray, isBool, isEmpty, isNum, isString, last, m, merge, path, prependTime, put, _, _base, _base1, _base2, _i, _len, _ref,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = [require('glob'), require('path'), require('dateformat'), require('lodash')], glob = _ref[0], path = _ref[1], df = _ref[2], _ = _ref[3];

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


  /*
  @todo Replace with Lodash methods
   */

  exports.last = last = function() {
    var args, array, back, context, _ref1;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (!isArray(args[0]) && isNum(args[0])) {
      back = args[0];
    } else if (isArray(args[0])) {
      array = args[0];
      back = (_ref1 = args[1]) != null ? _ref1 : 0;
    } else {
      back = 0;
    }
    context = array != null ? array : this;
    return context[context.length - back - 1];
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

  exports.put = put = function() {
    var ext_args, func, m, timestamps, type;
    m = arguments[0], ext_args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    type = ext_args[0], timestamps = ext_args[1];
    if (type == null) {
      type = 'log';
    }
    if (timestamps == null) {
      timestamps = false;
    }
    func = typeof console[type] === 'function' ? console[type] : console.log;
    if (timestamps) {
      m = prependTime(m);
    }
    return func(m);
  };

  exports.prependTime = prependTime = function(s, colorful) {
    var _formatted, _string;
    if (colorful == null) {
      colorful = true;
    }
    _formatted = df(new Date, "HH:MM:ss");
    if (colorful) {
      _formatted = "\u001b[4m" + _formatted + "\u001b[24m";
    }
    return _string = "" + _formatted + s;
  };

  exports.error = function(m, label) {
    if (label == null) {
      label = 'Error';
    }
    return put("\x20\u001b[31m✖ \u001b[1m" + label + ":\u001b[39m\u001b[22m \u001b[1m" + m + "\u001b[22m", 'log', true);
  };

  exports.info = function(m, label) {
    if (label == null) {
      label = 'Notice';
    }
    return put("\x20\u001b[34mℹ \u001b[1m" + label + ":\u001b[39m\u001b[22m " + m);
  };

  exports.warn = function(m, label) {
    if (label == null) {
      label = 'Warning';
    }
    return put("\x20\u001b[33m⚠ \u001b[1m" + label + ":\u001b[39m\u001b[22m " + m, 'log', true);
  };

  exports.succ = function(m, label) {
    if (label == null) {
      label = '';
    }
    return put("\x20\u001b[32m✔ \u001b[1m" + label + "\u001b[39m\u001b[22m " + m);
  };

  exports.isArray = isArray = function(_in) {
    if (Array.isArray !== void 0) {
      return Array.isArray(_in);
    } else {
      return Object.prototype.toString.call(_in) === '[object Array]';
    }
  };

  exports.isBool = isBool = function(_in) {
    return _in === true || _in === false || Object.prototype.toString.call(_in) === '[object Boolean]';
  };

  exports.isNum = isNum = function(_in) {
    return Object.prototype.toString.call(_in) === '[object Number]';
  };

  exports.isString = isString = function(_in) {
    return Object.prototype.toString.call(_in) === '[object String]';
  };

  exports.isEmpty = isEmpty = function(_in) {
    var key;
    if (_in == null) {
      return true;
    }
    if (isArray(_in) || isString(_in)) {
      return _in.length === 0;
    }
    for (key in _in) {
      if (Object.prototype.hasOwnProperty.call(_in, key)) {
        return false;
      }
    }
    return true;
  };

  exports.flatout = function(_in) {
    var line, _i, _len, _results;
    if (isArray(_in)) {
      _results = [];
      for (_i = 0, _len = _in.length; _i < _len; _i++) {
        line = _in[_i];
        _results.push(put(line));
      }
      return _results;
    } else {
      return put(_in);
    }
  };

  exports.require_relative = function(fi) {
    var _from, _req;
    _from = typeof __dirname !== "undefined" && __dirname !== null ? __dirname : process.cwd();
    _req = path.resolve(_from, path.normalize(fi));
    return require(_req);
  };

  exports.glob = extend(exports, glob);

  exports.Module = Module = (function() {
    function Module() {}

    Module.extend = function(obj) {
      var key, value, _ref1;
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this[key] = value;
        }
      }
      if ((_ref1 = obj.extended) != null) {
        _ref1.apply(this);
      }
      return this;
    };

    Module.include = function(obj) {
      var key, value, _ref1;
      for (key in obj) {
        value = obj[key];
        if (key !== 'extended' && key !== 'included') {
          this.prototype[key] = value;
        }
      }
      if ((_ref1 = obj.included) != null) {
        _ref1.apply(this);
      }
      return this;
    };

    return Module;

  })();

  globals = ['glob', 'put', 'isArray', 'isBool', 'isNum', 'isString', 'isEmpty', 'extend', 'include', 'merge'];

  for (_i = 0, _len = globals.length; _i < _len; _i++) {
    m = globals[_i];
    if (global[m] != null) {
      global['_' + m] = global[m];
    }
    global[m] = exports[m];
  }

  global['_'] = _;

}).call(this);
