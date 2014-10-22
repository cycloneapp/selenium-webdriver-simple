browser = require './lib/browser'

config =
    browser: 'chrome'
    selenium:
        path: './vendor'

browser.setup config
    

exports = (cfg) ->
