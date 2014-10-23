(function() {
  var compact, df, exports, extend, first, glob, globals, include, isArray, isBool, isEmpty, isNum, isString, last, m, merge, path, prependTime, put, _base, _base1, _base2, _i, _len, _ref,
    __slice = [].slice;

  _ref = [require('glob'), require('path'), require('dateformat')], glob = _ref[0], path = _ref[1], df = _ref[2];

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

  exports.put = put = function(m, type) {
    var func;
    if (type == null) {
      type = 'log';
    }
    func = typeof console[type] === 'function' ? console[type] : console.log;
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
    return put(prependTime("\x20\u001b[1m\u001b[31m✖ " + label + ":\u001b[39m\u001b[22m \u001b[1m" + m + "\u001b[22m"));
  };

  exports.info = function(m, label) {
    if (label == null) {
      label = 'Notice';
    }
    return put(prependTime("\x20\u001b[1m\u001b[34mℹ " + label + ":\u001b[39m\u001b[22m " + m));
  };

  exports.warn = function(m, label) {
    if (label == null) {
      label = 'Warning';
    }
    return put(prependTime("\x20\u001b[1m\u001b[33m⚠ " + label + ":\u001b[39m\u001b[22m " + m));
  };

  exports.succ = function(m, label) {
    if (label == null) {
      label = '';
    }
    return put(prependTime("\x20\u001b[1m\u001b[32m✔ " + label + "\u001b[39m\u001b[22m " + m));
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

  globals = ['glob', 'put', 'isArray', 'isBool', 'isNum', 'isString', 'isEmpty', 'extend', 'include', 'merge'];

  for (_i = 0, _len = globals.length; _i < _len; _i++) {
    m = globals[_i];
    if (global[m] != null) {
      global['_' + m] = global[m];
    }
    global[m] = exports[m];
  }

}).call(this);