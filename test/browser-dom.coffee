helper = (require './suite/browser-helper')(cap: true)

{config, chai, Browser, suite, faker} = helper
[it, describe, before, after, beforeEach, afterEach] = suite

should = chai.should()

describe 'SWS Browser', ->
    before ->
        @browser = new Browser config.browser, config.ext_opts
        return
    beforeEach ->
        @browser.start()
    afterEach ->
        @browser.client.close()
        @browser.reset()
        return
    after ->
        @browser.quit()
        return
    describe 'DOM actions', ->
        describe 'Elements find methods', ->
            it 'should fulfill promise for designated element', ->
                @browser.walk 'http://google.com'
                @browser
                    .find '[name=q]'
                    .should.be.fulfilled
                @browser
                    .find('.gbqfif')
                    .should.be.fulfilled
                    .and
                    .should.not.be.rejected

            it 'should reject global promise when searching for not existing element', ->
                @browser.walk 'http://google.com'
                @browser
                    .find '#asda'
                @browser.should.be.rejected

            before ->
                @searchText = ''
            it 'should open Google main page and search for generated text (i.e. input text and click search button)', ->
                @browser.walk 'http://google.com'
                @browser.findByName 'q'
                @browser.fill 'test'
                @browser.findByName 'btnG'
                @browser.click()
                @browser.should.not.be.rejected

            it 'should work with chainable methods', ->
                @browser
                    .walk 'http://google.com'
                    .findByName 'q'
                    .fill 'test'
                    .findByName 'btnG'
                    .click()
                @browser.should.not.be.rejected

            it 'should clear input text', ->
                @browser
                    .walk 'http://google.com'
                    .findByName 'q'
                    .fill 'test'
                    .clear()
                    .fill '123123'
                @browser.should.not.be.rejected

            it 'should validate state of global promise', ->
                @browser.walk 'http://google.com'
                @browser.title().should.eventually.equal 'Google'

            it 'should play nice with visible state of element', ->
                @browser.walk 'http://google.com'
                @browser.findByName('btnK').visible().should.eventually.be.true
                @browser.findByName('q').fill 'test'
                @browser.findByName('btnK').visible().should.eventually.be.false

                
