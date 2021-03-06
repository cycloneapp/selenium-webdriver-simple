(function() {
  var Matcher, util, wd, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = [require('./util'), require('./selenium').webdriver], util = _ref[0], wd = _ref[1];

  Matcher = (function() {
    function Matcher() {}

    Matcher.prototype.types = {
      'id': /^\#[\w\-]+$/,
      'class': /\s*\.[\w\-]+$/,
      'cssQuery': /[\w\-\s\*\>\[\]\:\.]+/,
      'name': /^[\w\-]+$/,
      'headTags': /^html|head|meta|link|title|body$/
    };

    Matcher.prototype.tags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "blockquote", "big", "body", "blink", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "comment", "datalist", "dd", "del", "details", "dfn", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "form", "footer", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "marquee", "mark", "menu", "meta", "meter", "nav", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "plaintext", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "span", "source", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "tt", "u", "ul", "var", "video", "wbr", "xmp"];

    Matcher.prototype.detect = function(_s) {
      var type;
      type = (function() {
        switch (true) {
          case this._testForTag(_s):
            return 'tag';
          case this._testForClass(_s):
            return 'css';
          case this._testForId(_s):
            return 'id';
          case this._testForName(_s):
            return 'name';
          case this._testForCssQuery(_s):
            return 'cssQuery';
          default:
            return false;
        }
      }).call(this);
      switch (type) {
        case 'tag':
          return wd.By.tagName;
        case 'id':
          return wd.By.id;
        case 'css':
          return wd.By.className;
        case 'cssQuery':
          return wd.By.css;
        default:
          return wd.By.name;
      }
    };

    Matcher.prototype.by = function(type) {
      if (type == null) {
        type = 'id';
      }
      if (wd.By[type] !== void 0) {
        return wd.By[type];
      } else {
        return wd.By.id;
      }
    };

    Matcher.prototype.is = function(_s, type) {
      if (type == null) {
        type = 'id';
      }
      if (this.types[type] != null) {
        return this.types[type].test(_s);
      }
      return false;
    };

    Matcher.prototype._testForId = function(el) {
      return this.types.id.test(el);
    };

    Matcher.prototype._testForClass = function(el) {
      return this.types["class"].test(el);
    };

    Matcher.prototype._testForTag = function(el) {
      if (this.types.headTags.test(el)) {
        return true;
      } else {
        return __indexOf.call(this.tags, el) >= 0;
      }
    };

    Matcher.prototype._testForName = function(el) {
      return this.types.name.test(el);
    };

    Matcher.prototype._testForCssQuery = function(el) {
      return this.types.cssQuery.test(el);
    };

    return Matcher;

  })();

  module.exports = Matcher;

}).call(this);
