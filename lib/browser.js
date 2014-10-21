(function() {
  var Browser, exports, selenium;

  selenium = require('./selenium').Selenium;

  Browser = (function() {
    Browser.verbose = false;

    function Browser(selenium) {
      this.server = selenium.startServer().getServer();
      if (this.t == null) {
        log('test');
      }
      this.client = new selenium.webdriver.Builder().usingServer(this.server.address()).withCapabilities(this._determineCapabilities()).build();
    }

    Browser.prototype.walk = function(url) {
      this.client.get(url);
      return this;
    };

    Browser.prototype.wait = function(cb, time) {
      if (time == null) {
        time = 1000;
      }
      this.client.wait(cb, time);
      return this;
    };

    Browser.prototype.click = function(ele) {
      this._find(ele).click();
      return this;
    };

    Browser.prototype.submit = function(id) {
      return this._;
    };

    Browser.prototype.waitFor = function() {
      return this;
    };

    Browser.prototype.fill = function(field, value) {
      this._find(field).then(function(ele) {
        ele.clear();
        return ele.sendKeys(value);
      });
      return this;
    };

    Browser.prototype.find = function(sel) {
      this.client.findElement(sel);
      return this;
    };

    Browser.prototype.title = function(cb) {
      this.client.getTitle().then(cb);
      return this;
    };

    Browser.prototype.reset = function() {
      var options;
      options = new selenium.webdriver.WebDriver.Options(this.client);
      return options.deleteAllCookies();
    };

    Browser.prototype.quit = function() {
      if (this.client != null) {
        this.client.quit();
      }
      if ((this.server != null) && this.server.isRunning()) {
        return this.server.stopServer();
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

    Browser.prototype._find = function(ele) {
      return this.client.findElement(ele);
    };

    Browser.prototype._determineCapabilities = function(selenium) {
      var _browser;
      if ((selenium != null) && (selenium.config() != null)) {
        _browser = selenium.config().browser;
      } else {
        _browser = 'firefox';
      }
      this.browser = _browser;
      return this.browser;
    };

    return Browser;

  })();

  exports = Browser;

}).call(this);
