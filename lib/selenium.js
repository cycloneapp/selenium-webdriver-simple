(function() {
  var Selenium, cfg, ext, util, _ref;

  _ref = [require('./util'), require('../config.json')], util = _ref[0], cfg = _ref[1];


  /*
  Selenium modules
   */

  Selenium = util.merge({}, {
    webdriver: require('selenium-webdriver'),
    server: require('selenium-webdriver/remote').SeleniumServer,
    portprober: require('selenium-webdriver/net/portprober')
  });


  /*
  Configuration
   */

  util.extend(Selenium, {
    config: function() {
      return cfg != null ? cfg.selenium : void 0;
    },
    setup: function(_arg) {
      this.path = _arg.path, this.host = _arg.host, this.port = _arg.port;
      if (this.path == null) {
        this.path = this.locate();
      }
      if (this.port == null) {
        this.port = this.portprober.findFreePort();
      }
      return this.configured = true;
    }
  });


  /*
  Extensions
   */

  ext = {
    locator: require('./selenium/locator'),
    updater: require('./selenium/updater')
  };

  util.extend(Selenium, ext.locator);

  util.extend(Selenium, ext.updater);


  /*
  run/stop server
   */

  util.extend(Selenium, {
    running: false,
    start: function(_arg) {
      var host, path, port;
      path = _arg.path, host = _arg.host, port = _arg.port;
      if (!this.configured) {
        this.setup();
      }
      this.server = new Selenium.server(this.path, {
        port: this.port
      });
      return this;
    },
    getInstance: function() {
      return this.server;
    },
    stop: function() {
      if (this.isRunning()) {
        this.server.stop();
      }
      return this;
    },
    isRunning: function() {
      if (this.server != null) {
        return this.server.isRunning();
      }
      return false;
    }
  });

  exports.Selenium = Selenium;

}).call(this);
