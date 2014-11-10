(function() {
  var DOMActions,
    __slice = [].slice;

  DOMActions = {
    find: function(sel) {
      return this._find(sel);
    },
    findAll: function(sel) {
      throw new $err.NotImplemented('method not implemented');
    },
    findByName: function(name) {
      throw new $err.NotImplemented('method not implemented');
    },
    findByText: function(text) {
      throw new $err.NotImplemented('method not implemented');
    },
    link: function(query) {
      return this._find(query);
    },
    linkByText: function(text) {
      return this._find(text, this.Matcher.by('partialLinkText'));
    },
    button: function(sel) {
      throw new $err.NotImplemented('method not implemented');
    },
    form: function(sel) {
      throw new $err.NotImplemented('method not implemented');
    },
    css: function(query) {
      throw new $err.NotImplemented('method not implemented');
    },
    submit: function(ele) {
      return this._setContext(this._resolveElement(ele).submit());
    },
    click: function(ele) {
      return this._setContext(this._resolveElement(ele).click());
    },
    fill: function() {
      var args, ele, val, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      ele = args[0], val = args[1];
      if (val == null) {
        _ref = [ele, this._getContext()], val = _ref[0], ele = _ref[1];
      } else if ((val != null) && (ele != null)) {
        ele = this._resolveElement(ele);
      }
      if (ele != null) {
        return this._setContext(ele.sendKeys(val));
      }
    },
    _find: function(ele, _by) {
      var _ele;
      _ele = _by != null ? this.client.findElement(_by(ele)) : this.client.findElement(this._by(ele));
      return this._setContext(_ele);
    },
    _by: function(sel) {
      console.log(this.Matcher.detect(ele)(this._cleanSelector(sel)));
      return this.Matcher.detect(ele)(this._cleanSelector(sel));
    },
    _cleanSelector: function(sel) {
      return sel.replace(/^[\#\.\>]/g, '');
    },
    _resolveElement: function(ele) {
      if (ele != null) {
        return this._find(ele);
      } else {
        return this._getContext();
      }
    }
  };

  module.exports = DOMActions;

}).call(this);
