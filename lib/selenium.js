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
      return (this.webdriver.Capabilities[browser] != null) && typeof this.webdriver.Capabilities[browser] === 'function';
    },
    getCapabilities: function(browser) {
      if (this.isCapable(browser)) {
        return this.webdriver.Capabilities[browser]();
      }
      return {};
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
    start: function() {
      if (!this.configured) {
        this.setup();
      }
      this._server = new Selenium.server(this.path, {
        port: this.port
      });
      this._server.start();
      return this;
    },
    getInstance: function() {
      return this._server;
    },
    stop: function() {
      if (this.isRunning()) {
        this._server.stop();
      }
      return this;
    },
    isRunning: function() {
      if (this._server != null) {
        return this._server.isRunning();
      }
      return false;
    }
  });

  module.exports = Selenium;

}).call(this);
