(function() {
  var $path, Selenium, SeleniumConfiguration, SeleniumJarLocator, SeleniumRunner, SeleniumVerbose, util, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
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
    haveBrowser: function(browser) {
      return __indexOf.call(this.knownBrowsers, browser) >= 0;
    },
    haveCapabilities: function(browser) {
      return (Selenium.webdriver.Capabilities[browser] != null) && typeof Selenium.webdriver.Capabilities[browser] === 'function';
    },
    defaultCapabilities: function() {},
    getCapabilities: function(browser) {
      if (this.haveCapabilities(browser)) {
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
      this.info('starting');
      this.srv().start();
      this.succ('server started');
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
      this.info('stopping');
      if (this.isRunning()) {
        this.srv().stop();
      } else {
        this.warn('already stopped?');
      }
      this.succ('ordered to stop');
      return this;
    },
    isRunning: function() {
      if (this._server != null) {
        return this.srv().isRunning();
      }
      return false;
    }
  };

  SeleniumVerbose = {
    logNs: 'selenium-server',
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

    Selenium.include(SeleniumVerbose);

    Selenium.prototype.knownBrowsers = (function(browsers) {
      return _.values(browsers);
    })(Selenium.webdriver.Browser);

    function Selenium(path, port, ext_args) {
      this.path = path != null ? path : "" + __dirname + "/../vendor";
      this.port = port != null ? port : Selenium.portprober.findFreePort();
      this.ext_args = ext_args != null ? ext_args : {};
      Selenium.__super__.constructor.call(this, this.logNs);
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
      this.logCondition(this.isVerbose());
      this.configured = true;
    }

    return Selenium;

  })(util.Modules.Logger);

  module.exports = Selenium;

}).call(this);
