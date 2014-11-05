(function() {
  var $path, Selenium, SeleniumConfiguration, SeleniumJarLocator, SeleniumLogger, SeleniumRunner, util, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = [require('./util'), require('path')], util = _ref[0], $path = _ref[1];


  /*
  Configuration
   */

  SeleniumConfiguration = {
    setup: function(args) {
      if (isEmpty(args)) {
        args = {
          path: Selenium.locate(),
          port: Selenium.portprober.findFreePort(),
          host: ''
        };
      }
      this.path = args.path, this.host = args.host, this.port = args.port;
      this.configured = true;
      return this;
    },
    isCapable: function(browser) {
      return (Selenium.webdriver.Capabilities[browser] != null) && typeof Selenium.webdriver.Capabilities[browser] === 'function';
    },
    getCapabilities: function(browser) {
      if (this.isCapable(browser)) {
        return Selenium.webdriver.Capabilities[browser]();
      }
      return {};
    }
  };


  /*
  run/stop server
   */

  SeleniumRunner = {
    running: false,
    start: function() {
      if (!this.configured) {
        this.setup();
      }
      this.srv(new Selenium.server(this.jar, {
        port: this.port
      }));
      if (this.isVerbose()) {
        this.info('starting');
      }
      this.srv().start();
      if (this.isVerbose()) {
        if (this.isRunning()) {
          this.succ('server started');
        }
      }
      return this;
    },
    address: function() {
      return this.srv().address();
    },
    srv: function(_srv) {
      if (_srv != null) {
        this._server = _srv;
        return this;
      }
      return this._server;
    },
    stop: function() {
      if (this.isVerbose()) {
        this.succ('scheduled to stop');
      }
      if (this.isRunning()) {
        this.srv().stop();
      } else {
        if (this.isVerbose()) {
          this.warn('already stopped?');
        }
      }
      return this;
    },
    isRunning: function() {
      if (this._server != null) {
        return this.srv().isRunning();
      }
      return false;
    }
  };

  SeleniumLogger = {
    logNs: 'selenium-server',
    log: function(msg) {
      return console.log(msg, this.logNs);
    },
    error: function(msg) {
      return util.error(msg, this.logNs);
    },
    info: function(msg) {
      return util.info(msg, this.logNs);
    },
    succ: function(msg) {
      return util.succ(msg, this.logNs);
    },
    isVerbose: function() {
      if (this.ext_args !== void 0 && !_.isUndefined(this.ext_args.verbose)) {
        return !!this.ext_args.verbose;
      } else {
        return false;
      }
    },
    setVerbose: function(val) {
      return this.ext_args.verbose = !!val;
    }
  };

  SeleniumJarLocator = require('./selenium/locator');


  /*
  Selenium modules
   */

  Selenium = (function(_super) {
    __extends(Selenium, _super);

    Selenium.webdriver = require('selenium-webdriver');

    Selenium.server = require('selenium-webdriver/remote').SeleniumServer;

    Selenium.portprober = require('selenium-webdriver/net/portprober');

    Selenium.include(SeleniumConfiguration);

    Selenium.include(SeleniumJarLocator);

    Selenium.include(SeleniumRunner);

    Selenium.include(SeleniumLogger);

    function Selenium(path, port, ext_args) {
      this.path = path != null ? path : "" + __dirname + "/../vendor";
      this.port = port != null ? port : Selenium.portprober.findFreePort();
      this.ext_args = ext_args != null ? ext_args : {};
      if (_.isEmpty(this.path)) {
        extend(this, {
          path: "" + __dirname + "/../vendor"
        });
      } else {
        this.path = $path.resolve(this.path);
      }
      if (_.isEmpty(this.port)) {
        extend(this, {
          port: Selenium.portprober.findFreePort()
        });
      }
      this.jar = this.locate();
      if (!_.isUndefined(this.ext_args.numericalPort) && _.isBoolean(this.ext_args.numericalPort)) {
        if ('then' in this.port) {
          this.port.then((function(_this) {
            return function(p) {
              return _this.port = p;
            };
          })(this));
        }
      }
      this.configured = true;
    }

    return Selenium;

  })(util.Module);

  module.exports = Selenium;

}).call(this);
