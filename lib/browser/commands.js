(function() {
  var BrowserCommands, options;

  options = require('selenium-webdriver').WebDriver.Options;

  BrowserCommands = {
    walk: function(url) {
      this.info("pointed to '" + url + "'");
      return this._setContext(this.client.get(url));
    },
    go: function() {
      return this.walk(arguments);
    },
    reset: function() {
      this.info("performing session reset");
      options = new options(this.client);
      options.deleteAllCookies();
      return this;
    },
    fullscreen: function() {
      this.info("maximizing browser window");
      this.manager().window().maximize();
      return this;
    },
    screenshot: function() {
      throw new $err.NotImplemented('method not implemented');
    },
    manager: function() {
      return this.client.manage();
    },
    logs: function() {
      return this.manager.logs();
    },
    quit: function() {
      var _then;
      if (this.client != null) {
        _then = (function(_this) {
          return function() {
            _this.info('trying to stop selenium-server');
            if (_this.server.stop != null) {
              return _this.server.stop();
            }
          };
        })(this);
        return this.client.quit().then(_then);
      }
    },
    stop: function() {
      if (this.client != null) {
        this.info('stopping client');
        this.reset();
        return this.client.quit().then((function(_this) {
          return function() {
            return _this.succ('client stopped');
          };
        })(this));
      }
    },
    sleep: function(cb, time) {
      if (time == null) {
        time = this.option('timeout');
      }
      this.info("ordered to sleep for " + time + "ms");
      this.client.sleep(time).then((function(_this) {
        return function() {
          _this.succ("was asleep for " + time + "ms");
          if (cb != null) {
            return cb();
          }
        };
      })(this));
      return this;
    }
  };

  module.exports = BrowserCommands;

}).call(this);
