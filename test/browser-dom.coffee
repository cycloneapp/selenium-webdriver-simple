helper = (require './suite/browser-helper')(cap: true)

{config, chai, Browser, suite} = helper
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
            it 'should find asked element', ->
                @browser.walk 'http://google.com'
                @browser.waitFor '[name=q]', (r) ->
                    r.should.be.true
                @browser.find('.gbqfif').should.not.be.rejectedWith Error

            it 'should fail when searching for not existing element', ->
                @browser.walk 'http://google.com'
                @browser
                    .find '#asda'
                @browser._getContext().should.be.rejected
