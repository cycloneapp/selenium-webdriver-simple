[util, path] = [
    require '../util'
    require 'path'
]

module.exports = 
    locate: ->
        @_locateJar()

    _locateJar: ->
        if not @jar?
            try 
                jar = path.resolve util.sync("#{@path}/selenium*.jar").first()
            catch e
                jar = null
            if not jar?
                throw (new Error "cannot locate Selenium server JAR, looked at '#{@path}'")
            else
                @jar = jar
        @jar
