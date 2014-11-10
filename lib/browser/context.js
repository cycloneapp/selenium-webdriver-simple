(function() {
  var Context;

  Context = {
    included: function() {
      return (function(_this) {
        return function() {
          var _ref;
          return _ref = [
            {}, function() {
              return this._context;
            }, function(_context) {
              this._context = _context;
              this.info('context changed');
              return this;
            }
          ], _this.prototype._context = _ref[0], _this.prototype._getContext = _ref[1], _this.prototype._setContext = _ref[2], _ref;
        };
      })(this)();
    }
  };

  module.exports = Context;

}).call(this);
