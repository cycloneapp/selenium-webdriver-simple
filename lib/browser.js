(function() {
  var $err, $selenium, Browser, BrowserCommands, BrowserContext, BrowserDOMActions, Matcher, util, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = [require('common-errors'), require('./selenium'), require('./util'), require('./matcher')], $err = _ref[0], $selenium = _ref[1], util = _ref[2], Matcher = _ref[3];


  /*
  Class mixins
   */

  _ref1 = [require('./browser/context'), require('./browser/commands'), require('./browser/dom-actions')], BrowserContext = _ref1[0], BrowserCommands = _ref1[1], BrowserDOMActions = _ref1[2];

  Browser = (function(_super) {
    __extends(Browser, _super);

    Browser.prototype.uid = null;

    Browser.prototype.client = null;

    Browser.prototype.server = null;

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

    Browser.Errors = $err;

    function Browser(config) {
      if (config == null) {
        config = {};
      }
      Browser.__super__.constructor.call(this);
      this._init(config);
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

    Browser.prototype.start = function() {
      this.stopSeleniumPingbacks();
      this.info("starting, uid: " + this.uid);
      this.server.start();
      this._checkCapabilities();
      this.client = new $selenium.webdriver.Builder().usingServer(this.server.address()).withCapabilities(this.option('capabilities')).build();
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


    /*
    @alias #walk
     */


    /*
    Waits desired time and executes callback
     */


    /*
    Clicks at links, buttons etc.
    If `element` not passed as argument, uses one stored as this._context
     */


    /*
    @todo
     */

    Browser.prototype.submit = function(id) {
      throw new $err.NotImplemented('method not implemented');
    };


    /*
    Returns current location
     */

    Browser.prototype.location = function(cb) {
      if (cb != null) {
        return this.client.getCurrentUrl().then(cb);
      }
      return this.client.getCurrentUrl();
    };


    /*
    Checks if ele exists or not and executes callbacks
    Best use with Browser::wait()
     */

    Browser.prototype.exists = function(ele, cb) {
      this.info("checking if element '" + ele + "' exists");
      if (cb != null) {
        return this.client.isElementPresent(this._by(ele)).then(function(res) {
          return cb(res);
        });
      }
      return this.client.isElementPresent(this._by(ele));
    };


    /*
    Waits for element to present
     */

    Browser.prototype.waitFor = function(ele, cb) {
      this.info("waiting for element '" + ele + "' to appear");
      this.client.wait((function(_this) {
        return function() {
          return _this.exists(ele).then(function(e) {
            return e;
          });
        };
      })(this), this.option('timeout')).then(function() {
        return cb(true);
      }).thenCatch((function(_this) {
        return function() {
          _this.warn("called #waitFor for element, failed to locate one");
          return cb(false);
        };
      })(this));
      return this;
    };


    /*
    Fills field with value
     */

    Browser.prototype.fill = function(field, value) {
      this._find(field).then(function(ele) {
        ele.clear();
        return ele.sendKeys(value);
      });
      return this;
    };


    /*
    @todo instance methods
     */

    Browser.prototype.url = function() {
      return this.location(arguments);
    };

    Browser.prototype.title = function(cb) {
      if (cb != null) {
        return this.client.getTitle().then(cb);
      }
      this._setContext(this.client.getTitle());
      return this;
    };


    /*
    end of instance methods
     */

    Browser.prototype.screenshot = function() {
      throw new $err.NotImplemented('method not implemented');
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
      return this._initConfig(config)._initLogger()._initSelenium();
    };

    Browser.prototype._initConfig = function(config) {
      config = _.defaults(config, {
        browser: 'firefox',
        selenium: {},
        verbose: false,
        timeout: 5000,
        fullscreen: false
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

    Browser.prototype._by = function(ele) {
      console.log(this.Matcher.detect(ele)(this._cleanSelector(ele)));
      return this.Matcher.detect(ele)(this._cleanSelector(ele));
    };

    Browser.prototype._checkCapabilities = function() {
      var _browser;
      _browser = this.option('browser' != null ? 'browser' : 'firefox');
      if (this.server.isCapable(_browser)) {
        this.option('browser', _browser);
      } else {
        this.option('browser', 'firefox');
      }
      this.info("determined to be capable of '" + (this.option('browser')) + "'");
      return this.option('capabilities', this.server.getCapabilities(this.option('browser')));
    };

    Browser.prototype._injectInstanceMethods = function() {
      this.manager = (function(_this) {
        return function() {
          return _this.client.manage();
        };
      })(this);
      return this.logs = (function(_this) {
        return function() {
          return _this.manager().logs();
        };
      })(this);
    };

    Browser.prototype._cleanSelector = function(sel) {
      return sel.replace(/^[\#\.\>]/g, '');
    };

    return Browser;

  })(util.Modules.Logger);

  Browser.useWdts = function(suite) {
    var describe, it, _ref2;
    if (suite == null) {
      suite = require('selenium-webdriver/testing');
    }
    _ref2 = [suite.it, suite.describe], it = _ref2[0], describe = _ref2[1];
    return [it, describe];
  };

  module.exports = Browser;

}).call(this);
