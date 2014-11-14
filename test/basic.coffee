config = (require './suite/config').ext_opts
should = require('chai').should()

describe 'Simple tests', ->
    describe 'Configuration', ->
        it 'should validate config', (d) ->
            config.should.be.an 'object'
            d()

        it 'must not find deprecated "browser" property', (d) ->
            config.should.not.have.property 'browser'
            d()

        it 'should ensure selenium property and some others are exists', (d) ->
            config.should.have.property 'selenium'
            config.selenium.path.should.not.be.undefined 
            d()

        
