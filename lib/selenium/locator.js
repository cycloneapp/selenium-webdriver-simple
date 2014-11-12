(function() {
  var path, util, _ref;

  _ref = [require('../util'), require('path')], util = _ref[0], path = _ref[1];

  module.exports = {
    locate: function() {
      return this._locateJar();
    },
    _locateJar: function() {
      var founds, paths, _fn, _k, _path;
      paths = [];
      if (this.jar == null) {
        if (this.path != null) {
          paths.push(this.path);
        }
        paths = _.union(paths, ["" + __dirname + "/../../vendor", "" + (process.cwd()) + "/./vendor", "" + process.env['HOME'] + "/./bin"]);
        founds = [];
        _fn = function(_path) {
          var matches;
          matches = util.sync("" + _path + "/selenium*.jar");
          if (!_.isEmpty(matches)) {
            return founds = _.union(founds, matches);
          }
        };
        for (_k in paths) {
          _path = paths[_k];
          _fn(_path);
        }
        if (!_.isEmpty(founds)) {
          this.jar = _.sample(founds);
          this.debug("found " + founds.length + " match(es), took " + this.jar + " for run");
        } else {
          throw new Error("cannot locate Selenium server JAR, looked at " + (paths.join(', ')));
        }
      }
      return this.jar;
    }
  };

}).call(this);
