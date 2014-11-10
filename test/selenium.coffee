config   = require './suite/config'
should   = require('chai').should()
Selenium = require '../lib/selenium'

describe 'Selenium tests', ->
    it 'should be able to initialize with default configuration', (done) ->
        try
            @selenium = new Selenium
        catch e
            # ...
        finally
            @selenium.should.not.be.undefined
            @selenium.should.have.property 'configured'
            @selenium.configured.should.be.ok

        done()
        
    it 'should fail on init if no selenium-server JAR is found', (done) ->
        _e = null
        try
            @selenium = new Selenium './not_existent_path'
        catch e
            _e = e
        finally
            _e.should.be.ok
            _e.should.be.instanceof Error
            
        done()

    after ->
        @selenium.stop() if @selenium.isRunning()
    it 'should start with default configuration', (done) ->
        try
            @selenium = new Selenium
            @selenium.start()
        catch e
            # ...
        finally
            @selenium.should.not.be.undefined
            @selenium.isRunning().should.be.ok

        done()
        
        
        
        
 
