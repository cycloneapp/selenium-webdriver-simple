(function() {
  var $err, $selenium, Browser, BrowserCommands, BrowserContext, BrowserDOMActions, Matcher, util, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = [require('common-errors'), require('./selenium'), require('./util'), require('./matcher')], $err = _ref[0], $selenium = _ref[1], util = _ref[2], Matcher = _ref[3];


  /*
  Class mixins
   */

  _ref1 = [require('./browser/context'), require('./browser/commands'), require('./browser/dom-actions')], BrowserContext = _ref1[0], BrowserCommands = _ref1[1], BrowserDOMActions = _ref1[2];


  /*
  @package Browser
   */

  Browser = (function(_super) {
    __extends(Browser, _super);

    Browser.prototype.uid = null;

    Browser.prototype.client = null;

    Browser.prototype.server = null;

    Browser.include(util.Modules.Deferred);

    Browser.include(BrowserContext);

    Browser.include(BrowserCommands);

    Browser.include(BrowserDOMActions);


    /*
    @var bool Use verbose output
     */

    Browser.prototype.verbose = false;


    /*
    @var mixed Current Browser context
    @private
     */

    Browser.prototype._context = null;


    /*
    @var object Browser.Errors Collection of exception classes, provided by `common-errors` package
     */

    Browser.Errors = $err;


    /*
    @param string this.browser Name of browser that will be used
    @param object ext_opts Additional runtime options
     */

    function Browser(browser, ext_opts) {
      this.browser = browser != null ? browser : 'firefox';
      if (ext_opts == null) {
        ext_opts = {};
      }
      Browser.__super__.constructor.call(this);
      this.validateOpts()._init(ext_opts);
      if (this.isAutostart()) {
        this.info('autostart');
        this.start();
        if (!this.isSrvRunning() && this.isAutostart()) {
          throw new $err.Error('Selenium server is not running');
        }
      } else {
        this.info('autostart disabled, waiting for start');
      }
    }

    Browser.prototype.validateOpts = function() {
      if ((this.browser == null) || !_.isString(this.browser)) {
        this.browser = 'firefox';
      }
      return this;
    };

    Browser.prototype.start = function() {
      this.info("starting, uid: " + this.uid);
      this.server.start();
      this.client = new $selenium.webdriver.Builder().usingServer(this.server.address()).withCapabilities(this.option('browserCapabilities')).setLoggingPrefs({
        browser: this.option('browserLog')
      }).build();
      if (this.isFullscreen()) {
        return this.fullscreen();
      }
    };


    /*
    Launches browser and opens provided URL
     */


    /*
    Returns promise of current stored context if exists
     */

    Browser.prototype.next = function(cb) {
      if (this._context !== void 0 && (this._context.then != null)) {
        this._context.then(cb);
      }
      return this;
    };

    Browser.prototype.then = function(onFullfill, onRejected, onNotified) {
      if (this._context != null) {
        this._context.then(onFullfill, onRejected, onNotified);
      }
      return this;
    };

    Browser.prototype.setVerbose = function(val) {
      return this.option('verbose', !!val);
    };

    Browser.prototype.isVerbose = function() {
      return !!this.option('verbose');
    };

    Browser.prototype.isFullscreen = function() {
      return !!this.option('fullscreen');
    };

    Browser.prototype.isSrvRunning = function() {
      if (this.server != null) {
        return this.server.isRunning();
      }
      return false;
    };

    Browser.prototype.isAutostart = function() {
      return !!this.option('selenium.autostart');
    };

    Browser.prototype.startSeleniumPingbacks = function() {
      return this._pingback = setInterval((function(_this) {
        return function() {
          _this.info('doing selenium-server life check');
          if (_this.isSrvRunning()) {
            return _this.succ('selenium-server is alive and running');
          } else {
            _this.info('looks like selenium-server stopped, restarting');
            return _this.server.start();
          }
        };
      })(this), 15000);
    };

    Browser.prototype.stopSeleniumPingbacks = function() {
      return clearInterval(this._pingback);
    };


    /*
    @internal
     */

    Browser.prototype._init = function(config) {
      this.uid = util.uuid();
      this.Matcher = new Matcher;
      this._initConfig(config)._initLogger()._initSelenium();
      return this.obtainCapabilities();
    };

    Browser.prototype._initConfig = function(config) {
      config = _.defaults(config, {
        browserLog: 'SEVERE',
        verbose: false,
        timeout: 5000,
        fullscreen: false,
        selenium: {}
      });
      config.selenium = _.defaults(config.selenium, {
        autostart: true,
        path: process.cwd(),
        port: null
      });
      this.mergeOpts(config);
      return this;
    };

    Browser.prototype._initSelenium = function() {
      this.server = new $selenium(this.option('selenium.path'), this.option('selenium.port'), {
        verbose: this.option('verbose')
      });
      this.succ('configured selenium-server');
      return this;
    };

    Browser.prototype._initLogger = function() {
      this.logPrefix('browser');
      this.logCondition(this.option('verbose'));
      return this;
    };

    Browser.prototype.obtainCapabilities = function() {
      var capabilities, _ref2;
      this.browser = (_ref2 = this.option('browser')) != null ? _ref2 : this.browser;
      capabilities = this.server.haveCapabilities(this.browser) ? this.server.getCapabilities(this.browser) : this.server.defaultCapabilities();
      return this.option('browserCapabilities', capabilities);
    };

    Browser.prototype._cleanSelector = function(sel) {
      return sel.replace(/^[\#\.\>]/g, '');
    };

    return Browser;

  })(util.Modules.Logger);

  Browser.useWdts = function(suite) {
    var after, afterEach, before, beforeEach, describe, it, _ref2;
    if (suite == null) {
      suite = require('selenium-webdriver/testing');
    }
    _ref2 = [suite.it, suite.describe, suite.before, suite.after, suite.beforeEach, suite.afterEach], it = _ref2[0], describe = _ref2[1], before = _ref2[2], after = _ref2[3], beforeEach = _ref2[4], afterEach = _ref2[5];
    return [it, describe, before, after, beforeEach, afterEach];
  };

  module.exports = Browser;

}).call(this);
