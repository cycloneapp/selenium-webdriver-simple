[util, path] = [
    require '../util'
    require 'path'
]

module.exports = 
    locate: ->
        @_locateJar()

    _locateJar: ->
        paths = []

        if not @jar?
            paths.push @path if @path?
            paths = _.union paths, [
                "#{__dirname}/../../vendor"
                "#{process.cwd()}/./vendor"
                "#{process.env['HOME']}/./bin"
            ]

            founds = []

            for _k, _path of paths
                do (_path) ->
                    matches = util.sync("#{_path}/selenium*.jar")
                    if not _.isEmpty(matches)
                        founds = _.union founds, matches

            if not _.isEmpty(founds)
                @jar = _.sample founds
                @debug "found #{founds.length} match(es), took #{@jar} for run"
            else
                throw (new Error "cannot locate Selenium server JAR, looked at #{paths.join(', ')}")
            #try 
            #jar = path.resolve util.sync("#{@path}/selenium*.jar").first()
            #catch e
            #    jar = null
            #if not jar?
            
            #else
            #@jar = jar
        @jar
