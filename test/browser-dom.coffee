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
                @browser.waitFor '[name=q]', (r) ->
                    r.should.be.true
                @browser
                    .find('.gbqfif')
                    .should.be.fulfilled
                    .and
                    .should.not.be.rejected

            it 'should reject element promise when searching for not existing element', ->
                @browser.walk 'http://google.com'
                @browser
                    .find '#asda'
                    .should.be.rejected

            before ->
                @searchText = ''
            it 'should open Google main page and search for generated text (i.e. input text and click search button)', ->
                @browser.walk 'http://google.com'
                @browser.fill 'test'


                
