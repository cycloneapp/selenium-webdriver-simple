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
    startServer: function() {
      this.server = new Selenium.server(this.locate(), {
        port: this.portprober.findFreePort()
      });
      this.running = true;
      return this;
    },
    getServer: function() {
      return this.server;
    },
    stopServer: function() {
      if (this.running) {
        this.server.stop();
      }
      return this;
    },
    isRunning: function() {
      return this.running;
    }
  });

  exports.Selenium = Selenium;

}).call(this);
