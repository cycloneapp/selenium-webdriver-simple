(function() {
  var DOMActions,
    __slice = [].slice;

  DOMActions = {
    ElementMethods: ['clear', 'click', 'findElement', 'findElements', 'getAttribute', 'getCssValue', 'getDriver', 'getId', 'getInnerHtml', 'getLocation', 'getOuterHtml', 'getSize', 'getTagName', 'getText', 'isDisplayed', 'isElementPresent', 'isEnabled', 'isSelected', 'schedule_', 'sendKeys', 'submit'],
    find: function(sel) {
      return this._find(sel);
    },
    findAll: function(sel) {
      throw new $err.NotImplemented('method not implemented');
    },
    findByName: function(name) {
      return this._find("[name=" + name + "]", this.Matcher.by('css'));
    },
    findByText: function(text) {
      return this._find(text, this.Matcher.by('partialText'));
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
      return this._resolveElement(ele).submit();
    },

    /*
    Clicks at links, buttons etc.
    If `element` not passed as argument, uses one stored as this._context
     */
    click: function(ele) {
      var _ele;
      _ele = this._resolveElement(ele);
      if (this.isPromise(_ele)) {
        return _ele.then(function(e) {
          return e.click();
        }, function(err) {
          return this.error(err);
        });
      }
    },

    /*
    Fills field with value
     */
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

    /*
    Checks if ele exists or not and executes callbacks
    Best use with Browser::wait()
     */
    exists: function(ele, cb) {
      this.info("checking if element '" + ele + "' exists");
      if (cb != null) {
        return this.client.isElementPresent(this._by(ele)).then(function(res) {
          return cb(res);
        });
      }
      return this.client.isElementPresent(this._by(ele));
    },

    /*
    Waits for element to present
     */
    waitFor: function(ele, cb) {
      this.info("waiting for element '" + ele + "' to appear");
      this.client.wait((function(_this) {
        return function() {
          return _this.exists(ele).then(function(e) {
            return e;
          });
        };
      })(this), this.option('timeout')).then(function() {
        return cb(true);
      }).thenCatch((function(_this) {
        return function() {
          _this.warn("called #waitFor for element, failed to locate one");
          return cb(false);
        };
      })(this));
      return this;
    },
    title: function(cb) {
      if (cb != null) {
        return this.client.getTitle().then(cb);
      }
      return this._setContext(this.client.getTitle());
    },
    _find: function(ele, _by) {
      this._context = _by != null ? this.client.findElement(_by(ele)) : this.client.findElement(this._by(ele));
      this._context.then((function(_this) {
        return function(e) {
          return _this._promise = _this._fulfill(e);
        };
      })(this)).thenCatch((function(_this) {
        return function() {
          return _this._promise = _this._reject("Element '" + ele + "' not found");
        };
      })(this));
      return this;
    },
    _by: function(sel) {
      this.debug(this.Matcher.detect(sel)(this._cleanSelector(sel)));
      return this.Matcher.detect(sel)(this._cleanSelector(sel));
    },
    _cleanSelector: function(sel) {
      return sel.replace(/^[\#\.\>]/g, '');
    },
    _resolveElement: function(ele) {
      if (ele == null) {
        if (this.isPromise() === true) {
          ele = this._promise;
        } else {
          return this._reject("Cannot resolve element without element selector");
        }
      } else {
        ele = this._find(ele);
      }
      return ele;
    }
  };

  module.exports = DOMActions;

}).call(this);
