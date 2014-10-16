var SeleniumLocator, cfg, exports, util, _ref;

_ref = [require('../util'), require('../../config.json')], util = _ref[0], cfg = _ref[1];

SeleniumLocator = {
  locate: function() {
    return console.log(this.config().latestVersion);
  }
};

exports = SeleniumLocator;
