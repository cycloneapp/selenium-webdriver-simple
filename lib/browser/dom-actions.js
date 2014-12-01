(function() {
  var $err, DOMActions,
    __slice = [].slice;

  $err = require('common-errors');

  DOMActions = {
    ElementMethods: ['clear', 'click', 'findElement', 'findElements', 'getAttribute', 'getCssValue', 'getDriver', 'getId', 'getInnerHtml', 'getLocation', 'getOuterHtml', 'getSize', 'getTagName', 'getText', 'isDisplayed', 'isElementPresent', 'isEnabled', 'isSelected', 'schedule_', 'sendKeys', 'submit'],
    _notImplementedMethods: function() {
      return ['findAll', 'button', 'form', 'css', 'cssValue', 'innerHtml', 'outerHtml'];
    },
    find: function(sel) {
      return this._find(sel);
    },
    findAll: function(sel) {
      throw new $err.NotImplementedError('method not implemented');
    },
    findByName: function(name) {
      return this._find("[name=" + name + "]", this.Matcher.by('css'));
    },
    findById: function(id) {
      return this._find(id, this.Matcher.by('id'));
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
      throw new $err.NotImplementedError('method not implemented');
    },
    form: function(sel) {
      throw new $err.NotImplementedError('method not implemented');
    },
    css: function(query) {
      throw new $err.NotImplementedError('method not implemented');
    },
    submit: function(ele) {
      return this._resolveElement(ele).submit();
    },
    id: function(ele) {
      return this.attr(ele, 'id');
    },
    innerHtml: function(ele) {
      throw new $err.NotImplementedError('method not implemented');
    },
    outerHtml: function(ele) {
      throw new $err.NotImplementedError('method not implemented');
    },
    text: function(ele) {
      var _defer;
      _defer = this.defer();
      this._resolveElement(ele).then((function(_this) {
        return function(e) {
          return e.getText().then(function(t) {
            return _defer.resolve(t);
          }).thenCatch(function(e) {
            return _defer.reject(e);
          });
        };
      })(this));
      return _defer.promise();
    },

    /*
    @notice Not chainable!
     */
    enabled: function(ele) {
      return this._resolveBool(ele, 'isEnabled');
    },

    /*
    @alias #visible
     */
    displayed: function(ele) {
      return this.visible(ele);
    },

    /*
    @notice Not chainable!
    @summary [covered]
     */
    visible: function(ele) {
      return this._resolveBool(ele, 'isDisplayed');
    },

    /*
    @description Get element attribute
    @param {string} [ele] Element selector to lookup
    @param {string} attr Attribute to get
    @summary [covered]
    @returns Promise
     */
    attr: function(ele, attr) {
      var _defer, _ref;
      if ((attr == null) && (ele != null)) {
        _ref = [attr, ele], ele = _ref[0], attr = _ref[1];
      }
      _defer = this.defer();
      this._resolveElement(ele).then(function(e) {
        return e.getAttribute(attr).then(function(v) {
          return _defer.resolve(v);
        }).thenCatch(function(e) {
          return _defer.reject(e);
        });
      });
      return _defer.promise();
    },
    cssValue: function(ele, option) {
      throw new $err.NotImplementedError('method not implemented');
    },

    /*
    @description Clears the input text from element
    @returns this
    @notice It 'reloads' context, meaning it leave context belonging to the same element, but reassing variable
    @summary [chainable, covered]
     */
    clear: function(ele) {
      this._resolveElement(ele).then((function(_this) {
        return function(e) {
          return _this._wrapPromise(e.clear());
        };
      })(this));
      return this;
    },

    /*
    @description Clicks at links, buttons etc. If `element` not passed as argument, uses one stored as this._context
    @returns this
    @summary [chainable, covered]
     */
    click: function(ele) {
      var _ele;
      _ele = this._resolveElement(ele);
      if (this.isPromise(_ele)) {
        this.debug("click: got promise");
        _ele.then((function(_this) {
          return function(e) {
            _this._setContext(e.click());
            return _this._adoptPromise(_this._context, true);
          };
        })(this), (function(_this) {
          return function(err) {
            return _this.error(err);
          };
        })(this));
      }
      return this;
    },

    /*
    @description Fills field with value
    @notice This method does not changes context!
    @returns this
    @summary [chainable, covered]
     */
    fill: function() {
      var args, ele, val, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      ele = args[0], val = args[1];
      if (val == null) {
        _ref = [ele, this._resolveElement()], val = _ref[0], ele = _ref[1];
      } else if ((val != null) && (ele != null)) {
        ele = this._resolveElement(ele);
      }
      if (ele != null) {
        if (this.isPromise(ele)) {
          ele.then((function(_this) {
            return function(_e) {
              return _this._adoptPromise(_e.sendKeys(val));
            };
          })(this));
        } else {
          this._adoptPromise(ele.sendKeys(val));
        }
      } else {
        this._adoptPromise(this._reject("no element resolved for #fill"));
      }
      return this;
    },

    /*
    @descriprion Checks if ele exists or not and executes callbacks. Best use with Browser::wait()
    @returns this
    @summary [chainable, covered]
     */
    exists: function(ele) {
      this.info("checking if element '" + ele + "' exists");
      return this._wrapPromise(this.client.isElementPresent(this._by(ele)));
    },

    /*
    Waits for element to present
    @todo: rewrite
    @returns this
    @summary [chainable, covered]
     */
    waitFor: function(ele, cb) {
      this.info("waiting for element '" + ele + "' to appear");
      return this._setContext(this.client.wait((function(_this) {
        return function() {
          return _this.exists(ele).then(function(e) {
            return e;
          });
        };
      })(this), this.option('timeout')).then((function(_this) {
        return function(e) {
          _this._adoptPromise(_this._fulfill(true));
          if (cb != null) {
            return cb(true);
          }
        };
      })(this)).thenCatch((function(_this) {
        return function() {
          _this._adoptPromise(_this._reject("called #waitFor for element, failed to locate one"));
          _this.warn("called #waitFor for element, failed to locate one");
          if (cb != null) {
            return cb(false);
          }
        };
      })(this)));
    },

    /*
    @returns this
    @summary [chainable]
     */
    title: function(cb) {
      return this._wrapPromise(this.client.getTitle());
    },

    /*
    @returns this
    @summary [chainable]
     */
    _find: function(ele, _by) {
      this.debug("searching for element '" + ele + "'");
      _by = _by != null ? _by(ele) : this._by(ele);
      return this._setContext(this.client.findElement(_by).then((function(_this) {
        return function(e) {
          return _this._adoptPromise(_this._fulfill(e));
        };
      })(this)).thenCatch((function(_this) {
        return function() {
          return _this._adoptPromise(_this._reject("Element '" + ele + "' not found"));
        };
      })(this)));
    },

    /*
    @returns webdriver.By
     */
    _by: function(sel) {
      this.debug(this.Matcher.detect(sel)(this._cleanSelector(sel)));
      return this.Matcher.detect(sel)(this._cleanSelector(sel));
    },
    _cleanSelector: function(sel) {
      return sel.replace(/^[\#\.\>]/g, '');
    },

    /*
    @returns this|this._context
    @summary [chainable]
     */
    _resolveElement: function(ele) {
      this.debug("resolving element '" + ele + "'");
      if (ele == null) {
        if (this._context != null) {
          this.debug("resolve: picking internal context as element");
          ele = this._context;
        } else {
          return this._reject("Cannot resolve element without element selector");
        }
      } else {
        this.debug("resolve: looking for element using _find()");
        ele = this._find(ele);
      }
      return ele;
    },

    /*
    @returns Promise
     */
    _resolveBool: function(ele, fn) {
      var _defer;
      _defer = this.defer();
      this._resolveElement(ele).then((function(_this) {
        return function(e) {
          return e[fn]().then(function(e) {
            if (_.isBoolean(e)) {
              return _defer.resolve(e);
            }
          }, function() {
            return _defer.reject();
          });
        };
      })(this));
      return _defer.promise();
    }
  };

  module.exports = DOMActions;

}).call(this);
