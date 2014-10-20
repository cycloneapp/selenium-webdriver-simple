[flour, util, path, nexpect] = [
    require 'flour'
    require './src/lib/util'
    require 'path'
    require 'nexpect'
]

#console.log util.globb()

#flour.compilers.coffee.bare = yes

# _makeCompileList = ->
#     mainlist    = util.glob.sync './src/**'

#     compileList = for file in mainlist
#         file if file.indexOf('.coffee') isnt -1

#     compileList = compileList.compact()
#     targetList  = for file in compileList
#         path.normalize file.replace(/src/, '').replace(/\.coffee/, '.js')

#     [compileList, targetList]
_compile = (dev = false) ->
    [cmd, args] = ['coffee', '--compile --no-header --output . src/'.split("\x20")]
    args.unshift('--bare') if dev

    nexpect.spawn cmd, args
        .run (e, o, ec) ->
            if e? or ec > 0
                console.log "Error during compile task: #{e ? ec}"
            else
                console.log "Done."

option '-d', '--dev', 'Enable development mode (bare)'
task 'compile', 'Compile CoffeeScripts', (opts) ->
    #[src, output] = _makeCompileList()
    #console.log util
    _compile(opts.dev ? no)

option '-f', '--file [FILE]', 'file to compile (default: "src/*.coffee")'
task 'show', 'Compile and print CoffeeScript  file', (opts) ->
    files = opts.file ? util.sync('./src/**').filter (_f) -> _f.indexOf('.coffee') isnt -1
    #if files
    #console.log '=============================='
    #compile files, (o) ->
    #    console.log '=============================='
    #    console.log "\u0002#{o.file.name}\u000F"
    #    console.log o.output
    #    console.log '=============================='


task 'install', 'Install selenium-standalone-server', (opts) ->
    selenium = require('./lib/selenium').Selenium
    
    selenium.runServer()
    console.log selenium.isRunning()
    selenium.stopServer()



