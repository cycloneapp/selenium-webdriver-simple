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
        @browser.walk 'http://google.com'
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
                @browser
                    .find '[name=q]'
                    .should.be.fulfilled
                @browser
                    .find('.gbqfif')
                    .should.be.fulfilled
                    .and
                    .should.not.be.rejected

            it 'should reject global promise when searching for not existing element', ->
                @browser
                    .find '#asda'
                @browser.should.be.rejected

            before ->
                @searchText = ''
            it 'should open Google main page and search for generated text (i.e. input text and click search button)', ->
                @browser.findByName 'q'
                @browser.fill 'test'
                @browser.findByName 'btnG'
                @browser.click()
                @browser.should.not.be.rejected

            it 'should work with chainable methods', ->
                @browser
                    .findByName 'q'
                    .fill 'test'
                    .findByName 'btnG'
                    .click()
                @browser.should.not.be.rejected

            it 'should clear input text', ->
                @browser
                    .findByName 'q'
                    .fill 'test'
                    .clear()
                    .fill '123123'
                @browser.should.not.be.rejected

            it 'should validate state of global promise', ->
                @browser.title().should.eventually.equal 'Google'

            it 'should play nice with visible state of element', ->
                @browser.findByName('btnK').visible().should.eventually.be.true
                @browser.findByName('q').fill 'test'
                @browser.findByName('btnK').visible().should.eventually.be.false

            it 'should retrieve ID of the element', ->
                @browser.findByName('q').id().should.eventually.equal 'gbqfq'

            it 'should retrieve text of the element', ->
                @browser.findById('gbqfsa').text().should.eventually.equal 'Поиск в Google'

            it 'should retrieve attribute value of the element', ->
                @browser.attr('[name=btnK]', 'aria-label').should.eventually.equal 'Поиск в Google'
                @browser.findByName('btnK').attr('aria-label').should.eventually.equal 'Поиск в Google'

            it 'should check the existense of element', ->
                @browser.exists('[name=btnK]').should.eventually.be.true

            it 'should wait until element will appear', ->
                @browser.waitFor('[name=btnK]').should.not.be.rejected


                
