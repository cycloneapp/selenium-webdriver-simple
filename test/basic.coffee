config = require './suite/config'
should = require('chai').should()

describe 'Simple tests', ->
    describe 'Configuration', ->
        it 'should validate config', (done) ->
            config.should.be.an 'object'
            done()

        it 'should ensure browser property exist', (d) ->
            config.should.have.property 'browser'
            d()

        it 'should ensure selenium property and some are exists', (d) ->
            config.should.have.property 'selenium'
            config.selenium.path.should.not.be.undefined 
            d()

        
