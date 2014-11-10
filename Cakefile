[flour, util, path, nexpect, child] = [
    require 'flour'
    require './src/lib/util'
    require 'path'
    require 'nexpect'
    require 'child_process'
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
_execc = (name, args = [], cb = (->), opts = {}) ->
    _child = child.execFile name, args, opts, (e, out, err) ->
        #console.log out if out?
        if e
            util.error "error while executing `#{name} #{args.join '\x20'}`"
            console.log "#{e}"
        else
            cb()
    _child.stdout.pipe process.stdout

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

    _execc cmd, argv, ->
        util.succ 'compiled successfully', 'compile'
        # else
        #     util.error 'compilation failed', 'compile'

_watch = (file) ->
    if file?
        _file = path.basename file
        util.info "#{_file} changed, recompiling", 'watch'

    process.nextTick ->
        _compile file

_run = (file) ->
    _file = path.basename file
    util.info "running #{_file}", 'runner'
    _execc 'node', [file], ->
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
            _run file

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

task 'get-selenium', 'Downloads selenium-server-standalone and places it in ./vendor directory', ->
    _path = path.resolve './vendor'
    _execc 'mkdir', ['-p', _path]
    _execc 'curl', ['-O', 'http://selenium-release.storage.googleapis.com/2.44/selenium-server-standalone-2.44.0.jar'], (-> util.succ('done')), {cwd: _path}


task 'testrun', 'Ensure Selenium server can start', (opts) ->
    Selenium = require('./lib/selenium')
    msg      = "Selenium server is" 

    selenium = new Selenium
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

task 'test', 'Run tests', ->
    _execc './node_modules/.bin/mocha'

