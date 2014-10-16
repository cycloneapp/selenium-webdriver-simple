[util, cfg] = [
    require '../util'
    require '../../config.json'
]

SeleniumLocator = 
    locate: ->
        console.log @config().latestVersion


exports = SeleniumLocator
