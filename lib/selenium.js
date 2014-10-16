var Selenium, cfg, util, _ref;

_ref = [require('./util'), require('../config.json')], util = _ref[0], cfg = _ref[1];


/*
Selenium modules
 */

Selenium = util.merge({}, {
  webdriver: require('selenium-webdriver'),
  server: require('selenium-webdriver/remote').SeleniumServer,
  portprober: require('selenium-webdriver/net/portprober'),
  test: require('selenium-webdriver/testing')
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

util.extend(Selenium, {
  locator: require('selenium/locator'),
  updater: require('selenium/updater')
});

exports.Selenium = Selenium;
