helper = (require './suite/browser-helper')(cap: true)
$err   = require 'common-errors'

{config, chai, Browser, suite, faker} = helper
[it, describe, before, after, beforeEach, afterEach] = suite

should = chai.should()

describe 'Internal tests', ->
    describe 'Browser', ->
        before ->
            @browser = new Browser config.browser, config.ext_opts
            return
        after ->
            @browser.quit()
            return

        it 'should throw NotImplemented error on not implemented methods', ->
            methods = @browser._notImplementedMethods()
            methods.should.be.instanceof Array

            if methods.size isnt 0
                for method in methods
                    @browser[method].should.throw $err.NotImplementedError
