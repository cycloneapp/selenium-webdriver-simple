config   = require './suite/config'
should   = require('chai').should()
Selenium = require '../lib/selenium'
Browser  = require '../lib/browser'

[it, describe, before, after, beforeEach, afterEach] = Browser.useWdts()

describe 'Selenium viability tests', ->
    describe 'SeleniumServer', ->
        it 'must initialize with default configuration', ->
            _try = =>
                @selenium = new Selenium

            _try.should.not.throw Error
            @selenium.should.not.be.undefined
            @selenium.should.have.property 'configured'
            @selenium.configured.should.be.ok

            
        it 'should not fail on init if wrong path for selenium-server JAR defined', ->
            _try = =>
                @selenium = new Selenium './not_existent_path'

            _try.should.not.throw Error

        after ->
            @selenium.stop() if @selenium.isRunning()
        it 'should start with default configuration', ->
            _try = =>
                @selenium = new Selenium
                @selenium.start()
            
            _try.should.not.throw Error
            @selenium.should.not.be.undefined
            @selenium.isRunning().should.be.ok

    describe 'SWS Browser', ->
        it 'must initialize with default configuration', ->
            _try = =>
                @browser = new Browser config.browser, config.ext_opts

            _try.should.not.throw Error
            @browser.should.not.be.undefined
            @browser.should.have.property 'opts'
            @browser.opts.should.not.be.null
            @browser.should.have.property 'uid'
            @browser.uid.should.not.be.null
        
        describe '-> Browsers', ->
            describe '-> PhantomJS startup tests', ->
                before ->
                    _config = _.extend config, {browser: 'phantomjs'}
                    @browser = new Browser _config.browser, _config.ext_opts
                    return

                it 'should check if PhantomJS runtime is usable', ->
                    _try = do(browser = @browser) ->
                        ->
                            browser.start()
                            browser.walk 'http://google.com'
                            browser.reset()
                            browser.quit()

                    _try.should.not.throw Error

            describe '-> Chrome startup tests (via ChromeDriver)', ->
                before ->
                    _config = _.extend config, {browser: 'chrome'}
                    @browser = new Browser _config.browser, _config.ext_opts
                    return

                it 'should check if Chrome runtime is usable', ->
                    _try = =>
                        @browser.start()
                        @browser.walk 'http://google.com'
                        @browser.reset()
                        @browser.quit()

                    _try.should.not.throw Error
                    

            describe '-> Firefox startup tests', ->
                before ->
                    _config = _.extend config, {browser: 'firefox'}
                    @browser = new Browser _config.browser, _config.ext_opts
                    return

                it 'should check if Firefox runtime is usable', ->
                    _try = =>
                        @browser.start()
                        @browser.walk 'http://google.com'
                        @browser.reset()
                        @browser.quit()

                    _try.should.not.throw Error

            describe '-> Opera startup tests', ->
                before ->
                    _config = _.extend config, {browser: 'opera'}
                    @browser = new Browser _config.browser, _config.ext_opts
                    return

                it 'should check if Opera runtime is usable', ->
                    _try = =>
                        @browser.start()
                        @browser.walk 'http://google.com'
                        @browser.reset()
                        @browser.quit()

                    _try.should.not.throw Error            

                
                
