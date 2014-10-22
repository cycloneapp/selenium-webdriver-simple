(function() {
  var browser, config, exports;

  browser = require('./lib/browser');

  config = {
    browser: 'chrome',
    selenium: {
      path: './vendor'
    }
  };

  browser.setup(config);

  exports = function(cfg) {};

}).call(this);
