(function() {
  var cfg, path, util, _ref;

  _ref = [require('../util'), require('path'), require('../../config.json')], util = _ref[0], path = _ref[1], cfg = _ref[2];

  module.exports = {
    locate: function() {
      return this._locateJar();
    },
    _locateJar: function() {
      var e, jar;
      console.log(this.path);
      if (this.jar == null) {
        try {
          jar = path.resolve(util.sync("" + this.path + "/selenium-standalone*.jar").first());
        } catch (_error) {
          e = _error;
          jar = null;
        }
        if (jar == null) {
          throw new Error("cannot locate Selenium server JAR, looked at '" + this.path + "'");
        } else {
          this.jar = jar;
        }
      }
      return this.jar;
    }
  };

}).call(this);
