(function() {
  var $err, $match, $selenium, Browser, util, _ref;

  _ref = [require('./selenium'), require('common-errors'), require('./util'), require('./matcher')], $selenium = _ref[0], $err = _ref[1], util = _ref[2], $match = _ref[3];

  Browser = (function() {

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
      var selenium, _ref1;
      this.config = config;
      if (_.isEmpty(this.config) || _.isUndefined(this.config)) {
        this.config = {};
      }
      this.config = _.defaults(this.config, {
        browser: 'firefox',
        selenium: {
          path: process.cwd(),
          port: null
        },
        verbose: false,
        timeout: 5000
      });
      _ref1 = this.config, this.browser = _ref1.browser, selenium = _ref1.selenium, this.verbose = _ref1.verbose, this.timeout = _ref1.timeout;
      if (this.verbose) {
        util.info('starting selenium-server', 'browser');
      }
      this.server = new $selenium(selenium.path, selenium.port);
      this.server.start();
      if (!this.server.isRunning()) {
        throw new $err.Error('Selenium server is not running');
      } else {
        util.succ('selenium-server started', 'browser');
      }
      this._checkCapabilities();
      this.client = new $selenium.webdriver.Builder().usingServer(this.server.address()).withCapabilities(this.capabilities).build();
      this._injectInstanceMethods();
    }


    /*
    Launches browser and opens provided URL
     */

    Browser.prototype.walk = function(url) {
      this._setContext(this.client.get(url));
      return this;
    };


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
    @alias Browser::walk
     */

    Browser.prototype.go = function() {
      return this.walk(arguments);
    };


    /*
    Waits desired time and executes callback
     */

    Browser.prototype.wait = function(cb, time) {
      if (time == null) {
        time = 1000;
      }
      this._setContext(this.client.wait(cb, time));
      return this;
    };


    /*
    Clicks at links, buttons etc.
    If `element` not passed as argument, uses one stored as this._context
     */

    Browser.prototype.click = function(ele) {
      var ctx;
      if (ele == null) {
        ctx = this._getContext();
        ctx.click();
      } else {
        this._setContext(this._find(ele).click());
      }
      return this;
    };


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

    Browser.prototype.exists = function(ele, cb, ecb) {
      if (cb == null) {
        cb = (function() {
          return true;
        });
      }
      if (ecb == null) {
        ecb = (function() {
          return false;
        });
      }
      if ((cb != null) || (ecb != null)) {
        return this.client.isElementPresent(this._by(ele)).then(cb, ecb);
      }
      return this.client.isElementPresent(this._by(ele));
    };


    /*
    Waits for element to present
    @notice WIP!
     */

    Browser.prototype.waitFor = function(ele, scb, ecb) {
      var periodical, tries;
      tries = 0;
      periodical = setInterval((function(_this) {
        return function() {
          var _e;
          _e = _this.client.isElementPresent(ele);
          if (_e) {
            scb();
            return clearInterval(periodical);
          } else {
            if (tries < 5) {
              return tries = tries + 1;
            } else {
              return ecb();
            }
          }
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
      } else {
        this._setContext(this.client.getTitle());
        return this;
      }
    };


    /*
    end of instance methods
     */

    Browser.prototype.sleep = function(time) {
      if (time == null) {
        time = this.timeout;
      }
      return this.wait(function() {
        return util.succ("was asleep for " + time + "ms");
      }, time);
    };

    Browser.prototype.screenshot = function() {
      throw new $err.NotImplemented('method not implemented');
    };

    Browser.prototype.find = function(sel) {
      this._setContext(this._find(sel));
      return this;
    };

    Browser.prototype.findByText = function(text) {
      this._setContext(this._find(text, $match.by('partialLinkText')));
      return this;
    };

    Browser.prototype.reset = function() {
      var options;
      options = new $selenium.webdriver.WebDriver.Options(this.client);
      options.deleteAllCookies();
      return this;
    };

    Browser.prototype.quit = function() {
      if (this.client != null) {
        this.client.quit();
      }
      if ((this.server != null) && this.server.isRunning()) {
        return this.server.stop();
      }
    };

    Browser.prototype.setVerbose = function(val) {
      return this.verbose = val;
    };

    Browser.prototype.isVerbose = function() {
      if ((this.verbose != null) && this.verbose) {
        return true;
      } else {
        return false;
      }
    };


    /*
    @internal
     */

    Browser.prototype._find = function(ele, _by) {
      if (_by != null) {
        return this.client.findElement(_by(ele));
      }
      return this.client.findElement(this._by(ele));
    };

    Browser.prototype._by = function(ele) {
      return $match.detect(ele)(this._cleanSelector(ele));
    };

    Browser.prototype._checkCapabilities = function() {
      var _browser;
      _browser = (this.config != null) && (this.config.browser != null) && !isEmpty(this.config.browser) ? this.config.browser : 'firefox';
      if (this.server.isCapable(_browser)) {
        this.browser = _browser;
      } else {
        this.browser = 'firefox';
      }
      return this.capabilities = this.server.getCapabilities(this.browser);
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

    Browser.prototype._getContext = function() {
      return this._context;
    };

    Browser.prototype._setContext = function(c) {
      this._context = c;
      return this;
    };

    Browser.prototype._cleanSelector = function(sel) {
      return sel.replace(/[\#\.\>]/g, '');
    };

    return Browser;

  })();

  Browser.useWdts = function(suite) {
    var describe, it, _ref1;
    if (suite == null) {
      suite = require('selenium-webdriver/testing');
    }
    _ref1 = [suite.it, suite.describe], it = _ref1[0], describe = _ref1[1];
    return [it, describe];
  };

  module.exports = Browser;

}).call(this);
