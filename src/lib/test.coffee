getFuncs = /([\w\.\_]+)?\s*?\=\s*?function\(/
getRets = /return\s*?((?:new)?[\w\.\_\s]*)?(?:\;|\()/

#console.log process.cwd()
#console.log __dirname
#console.log __filename

b = require './browser'
m = require './matcher'
#console.log m.detect('super-form')()
browser = new b
browser.walk 'http://ya.ru'
browser.exists('#text').then ->
    console.log arguments
#browser.client.isElementPresent {id: 'text'}
#    .then ->
#        console.log arguments

###
@internal
###
class BrowserElement
    ###
    @param webdriver.WebElement element
    @param Browser context
    ###
    constructor: (@element, @context) ->
        if not @element?
            throw (new $err.ArgumentNullError 'element')
        if not @context?
            throw (new $err.ArgumentNullError 'context')


