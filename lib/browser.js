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
      if (isEmpty(this.config)) {
        this.config = {
          browser: '',
          selenium: '',
          verbose: false,
          timeout: 5000
        };
      }
      _ref1 = this.config, this.browser = _ref1.browser, selenium = _ref1.selenium, this.verbose = _ref1.verbose, this.timeout = _ref1.timeout;
      if (this.verbose) {
        util.info('starting selenium-server', 'browser');
      }
      $selenium.setup(selenium).start();
      if (!$selenium.isRunning()) {
        throw new $err.Error('Selenium server is not running');
      } else {
        util.succ('selenium-server started', 'browser');
      }
      this._checkCapabilities();
      this.server = $selenium.getInstance();
      this.client = new $selenium.webdriver.Builder().usingServer(this.server.address()).withCapabilities(this.capabilities).build();
    }

    Browser.prototype.walk = function(url) {
      this._setContext(this.client.get(url));
      return this;
    };


    /*
    Returns promise of current stored context if exists
     */

    Browser.prototype.then = function(cb) {
      if (this._context.then != null) {
        this._context.then(cb);
      }
      return this;
    };

    Browser.prototype.go = function() {
      this.walk(arguments);
      return this;
    };

    Browser.prototype.wait = function(cb, time) {
      if (time == null) {
        time = 1000;
      }
      this._setContext(this.client.wait(cb, time));
      return this;
    };

    Browser.prototype.click = function(ele) {
      this._setContext(this._find(ele).click());
      return this;
    };

    Browser.prototype.submit = function(id) {
      return this;
    };

    Browser.prototype.location = function(cb) {
      if (cb != null) {
        return this.client.getCurrentUrl().then(cb);
      }
      return this.client.getCurrentUrl();
    };

    Browser.prototype.exists = function(ele) {
      return this.client.isElementPresent(this._by(ele));
    };

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
      return this.client.getCurrentUrl();
    };

    Browser.prototype.title = function(cb) {
      this.client.getTitle().then(cb);
      return this;
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

    Browser.prototype._find = function(ele) {
      return this.client.findElement(this._by(ele));
    };

    Browser.prototype._by = function(ele) {
      return $match.detect(ele)(this._cleanSelector(ele));
    };

    Browser.prototype._checkCapabilities = function() {
      var _browser;
      _browser = (this.config != null) && (this.config.browser != null) && !isEmpty(this.config.browser) ? this.config.browser : 'firefox';
      if ($selenium.isCapable(_browser)) {
        this.browser = _browser;
      } else {
        this.browser = 'firefox';
      }
      return this.capabilities = $selenium.getCapabilities(this.browser);
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

  module.exports = Browser;

}).call(this);
