(function() {
  var BrowserElement, b, browser, getFuncs, getRets, m;

  getFuncs = /([\w\.\_]+)?\s*?\=\s*?function\(/;

  getRets = /return\s*?((?:new)?[\w\.\_\s]*)?(?:\;|\()/;

  b = require('./browser');

  m = require('./matcher');

  browser = new b;

  browser.walk('http://ya.ru').then(function() {
    return browser.location(function(l) {
      return console.log(l);
    });
  });


  /*
  @internal
   */

  BrowserElement = (function() {

    /*
    @param webdriver.WebElement element
    @param Browser context
     */
    function BrowserElement(element, context) {
      this.element = element;
      this.context = context;
      if (this.element == null) {
        throw new $err.ArgumentNullError('element');
      }
      if (this.context == null) {
        throw new $err.ArgumentNullError('context');
      }
    }

    return BrowserElement;

  })();

}).call(this);
