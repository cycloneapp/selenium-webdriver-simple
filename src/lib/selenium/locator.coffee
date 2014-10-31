[util, path, cfg] = [
    require '../util'
    require 'path'
    require '../../config.json'
]

module.exports = 
    locate: ->
        @_locateJar()

    _locateJar: ->
        console.log @path
        if not @jar?
            try 
                jar = path.resolve util.sync("#{@path}/selenium-standalone*.jar").first()
            catch e
                jar = null
            if not jar?
                throw (new Error "cannot locate Selenium server JAR, looked at '#{@path}'")
            else
                @jar = jar
        @jar
