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
_compile = (args...) ->
    dev = if util.isBool(util.first(args))
        util.first(args)
    else
        false

    file = if args.length > 1 or not util.isBool(util.first(args))
        util.last(args)
    else
        'src/'

    dest = if file isnt 'src/'
        path.dirname(path.resolve(file).replace(path.join(__dirname, 'src'), '.'))
    else
        '.'

    _opts = "--compile --no-header --output #{dest} #{file}"


    [cmd, argv] = ['coffee', _opts.split("\x20")]
    args.unshift('--bare') if dev

    _run cmd, argv, (_c) ->
        if _c is 0
            util.succ 'compiled successfully', 'compile'
        else
            util.error 'compilation failed', 'compile'

_watch = (file) ->
    if file?
        _file = path.basename file
        util.info "#{_file} changed, recompiling", 'watch'

    _compile file

_run = (args...) ->
    [_cmd, _args, _cb] = args
    _args ?= []

    unless _cmd?
        throw (new Error 'no command given to run ')

    nexpect.spawn _cmd, _args
        .run (e, o, ec) ->
            if ec > 0 and e isnt undefined
                util.error "error while executing cmd `#{_cmd}` with args `#{_args.join '\x20'}`: #{if e? then ''+e+', ' else ''}exit code #{ec}"
            if e
                console.log e                
            if o and o.length isnt 0
                console.log o.join("\n")
            if _cb
                _cb(ec)

_exec = (file) ->
    _file = path.basename file
    util.info "running #{_file}", 'runner'
    _run 'node', [file], ->
        util.succ "finished #{_file}", 'runner'


option '-d', '--dev', 'Enable development mode (bare)'
task 'compile', 'Compile CoffeeScripts', (opts) ->
    _compile(opts.dev ? no)

option '-r', '--run', 'Run compiled code'
option '-m', '--use-macros', 'Parse compiled JS with Comment-Macros (for testing)'
task 'watch', 'Compile sources on changes', (opts) ->
    invoke 'compile'
    watch [
        'src/*.coffee'
        'src/*/*.coffee'
        'src/*/*/*.coffee'
    ], (args...) ->
        [stat, file] = args
        _watch file
    if opts.run?
        watch [
            'lib/*.js'
            'lib/*/*.js'
        ], (stat, file) ->
            _exec file

option '-f', '--file [FILE]', 'File to cover'
task 'coverage:methods', 'Returns methods defined in given file', (opts) ->
    [fs, regex] = [
        require 'fs'
        new RegExp '([\\w\\.\\_]+)?\\s*?\\=\\s*?function\\(', 'gm'
    ]

    if not opts.file?
        util.error 'no file specified', 'coverage'
        return

    file = opts.file
    fs.exists file, (_e) ->
        if _e
            fs.readFile file, (e, c) ->
                throw e if e
                matches = while _m = regex.exec c
                    _m[1]
                if matches.length isnt 0
                    util.info 'found '+matches.length+' match(es)', 'coverage'
                    util.flatout matches
                else
                    util.info 'no matches found', 'coverage'
        else
            util.error 'file not exists', 'coverage'
            return

task 'ttt', 'ttt', (o) ->
    console.log '1'

# option '-f', '--file [FILE]', 'file to compile (default: "src/*.coffee")'
# task 'show', 'Compile and print CoffeeScript  file', (opts) ->
#     files = opts.file ? util.sync('./src/**').filter (_f) -> _f.indexOf('.coffee') isnt -1

    #if files
    #console.log '=============================='
    #compile files, (o) ->
    #    console.log '=============================='
    #    console.log "\u0002#{o.file.name}\u000F"
    #    console.log o.output
    #    console.log '=============================='


task 'testrun', 'Ensure Selenium server can start', (opts) ->
    selenium = require('./lib/selenium')
    msg      = "Selenium server is" 

    util.info 'starting selenium-server', 'selenium-testrun'
    selenium.start()
    util.info 'waiting for 5000ms...', 'selenium-testrun'
    setTimeout ->
        if selenium.isRunning()
            util.succ "#{msg} running"
        else
            util.error "#{msg} not running"
        selenium.stop()
    , 5000

    # if selenium.isRunning()
    #     
    # else
    #     
    #     console.log selenium
    # selenium.stop()



