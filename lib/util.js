(function() {
  var Configuration, Logger, Module, compact, df, exports, extend, first, glob, globals, include, isArray, isBool, isEmpty, isNum, isString, last, m, merge, path, prependTime, put, vow, _, __label, _base, _base1, _base2, _debug, _error, _i, _info, _len, _log, _ref, _succ, _warn,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = [require('glob'), require('path'), require('dateformat'), require('vow'), require('lodash')], glob = _ref[0], path = _ref[1], df = _ref[2], vow = _ref[3], _ = _ref[4];

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

  __label = function(l) {
    return "\x1b[;38;5;31m\u001b[1m" + l + "\u001b[22m\x1b[0m";
  };

  exports.error = _error = function(m, label) {
    if (label == null) {
      label = 'Error';
    }
    return put("\x20" + (__label(label)) + "\x20\u001b[31m\u001b[1merror\u001b[39m\u001b[22m\x20" + m, 'log');
  };

  exports.info = _info = function(m, label) {
    if (label == null) {
      label = 'Notice';
    }
    return put("\x20" + (__label(label)) + "\x20\u001b[34m\u001b[1minfo\u001b[39m\u001b[22m\x20" + m);
  };

  exports.warn = _warn = function(m, label) {
    if (label == null) {
      label = '';
    }
    return put("\x20" + (__label(label)) + "\x20\u001b[33m\u001b[1mwarning\u001b[39m\u001b[22m\x20" + m, 'log');
  };

  exports.succ = _succ = function(m, label) {
    if (label == null) {
      label = '';
    }
    return put("\x20" + (__label(label)) + "\x20\u001b[32m\u001b[1msuccess\u001b[39m\u001b[22m\x20" + m);
  };

  exports.debug = _debug = function(m, label) {
    if (label == null) {
      label = '';
    }
    return put("\x20" + (__label(label)) + "\x20\u001b[35m\u001b[1mdebug\u001b[39m\u001b[22m\x20" + m);
  };

  exports.log = _log = function(m, label) {
    if (label == null) {
      label = '';
    }
    return put("\x20" + label + "\x20" + m);
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
    if (isBool(_in)) {
      return false;
    }
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

  exports.uuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };

  exports.glob = extend(exports, glob);

  exports.Module = Module = (function() {
    function Module() {}

    Module.extend = function(obj) {
      var key, value, _ref1;
      for (key in obj) {
        value = obj[key];
        if (key !== 'extended' && key !== 'included') {
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

  exports.Modules = {};

  exports.Modules.Extendable = {
    "__extends": function(klass) {
      return this.prototype = _.create(klass.prototype, {
        'constructor': this.prototype.constructor,
        '__super__': klass.prototype
      });
    }
  };


  /*
  @todo Make it class
   */

  exports.Modules.Configuration = Configuration = (function(_super) {
    __extends(Configuration, _super);

    function Configuration() {
      this.opts = {};
    }

    Configuration.prototype.mergeOpts = function(opts) {
      return this.opts = _.assign(this.opts, opts);
    };

    Configuration.prototype.option = function(opt, val) {
      var _opt;
      if (/\./g.test(opt)) {
        _opt = this._recursiveOpt(opt);
        return _opt;
      } else {
        if (val != null) {
          this.opts[opt] = val;
        }
        if (this.hasOpt(opt)) {
          return this.opts[opt];
        }
      }
    };

    Configuration.prototype.hasOpt = function(opt) {
      return this.opts[opt] !== void 0;
    };

    Configuration.prototype._recursiveOpt = function(opt) {
      var piece, pieces, _i, _key, _len, _ref1, _ref2, _val;
      pieces = opt.split('.');
      _ref1 = [_.last(pieces), this.opts], _key = _ref1[0], _val = _ref1[1];
      _ref2 = _.initial(pieces);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        piece = _ref2[_i];
        if (_val[piece] != null) {
          _val = _val[piece];
        }
      }
      if ((_val != null) && (_val[_key] != null)) {
        return _val[_key];
      }
    };

    Configuration.prototype.config = function() {
      return this.opts;
    };

    return Configuration;

  })(Module);

  exports.Modules.Logger = Logger = (function(_super) {
    __extends(Logger, _super);

    function Logger(prefix) {
      Logger.__super__.constructor.call(this);
      this.log_opts = {
        prefix: 'logger',
        condition: false
      };
      if (prefix != null) {
        this.logPrefix(prefix);
      }
    }

    Logger.prototype.logCondition = function(condition) {
      var _ref1;
      if (condition != null) {
        if ((_ref1 = this.log_opts) != null) {
          _ref1.condition = !!condition;
        }
      }
      return !!this.log_opts.condition;
    };

    Logger.prototype.logPrefix = function(prefix) {
      var _ref1;
      if (prefix != null) {
        if (!_.isString(prefix)) {
          prefix = Object.prototype.toString.call(prefix);
        }
        if ((_ref1 = this.log_opts) != null) {
          _ref1.prefix = prefix;
        }
      }
      return this.log_opts.prefix;
    };

    Logger.prototype.log = function(msg) {
      if (this.logCondition()) {
        return _log(msg, this.logPrefix());
      }
    };

    Logger.prototype.succ = function(msg) {
      if (this.logCondition()) {
        return _succ(msg, this.logPrefix());
      }
    };

    Logger.prototype.error = function(msg) {
      if (this.logCondition()) {
        return _error(msg, this.logPrefix());
      }
    };

    Logger.prototype.info = function(msg) {
      if (this.logCondition()) {
        return _info(msg, this.logPrefix());
      }
    };

    Logger.prototype.warn = function(msg) {
      if (this.logCondition()) {
        return _warn(msg, this.logPrefix());
      }
    };

    Logger.prototype.debug = function(msg) {
      return _debug(msg, this.logPrefix());
    };

    return Logger;

  })(Configuration);

  exports.Modules.Deferred = {
    defer: function() {
      return new vow.Deferred();
    }
  };

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
