[util, path, cfg] = [
    require '../util'
    require 'path'
    require '../../config.json'
]

module.exports = 
    locate: ->
        @_locateJar()

    _locateJar: ->
        if not @_jar?
            try 
                jar = path.resolve util.sync("./#{@config().path}/selenium-standalone*.jar").first()
            catch e
                jar = null
            if not jar?
                throw (new Error 'cannot locate Selenium standalone server JAR')
            else
                @_jar = jar
        @_jar
