config  = require './config'
chai    = require 'chai'
cap     = require 'chai-as-promised'
browser = require '../../lib/browser'


module.exports = (opts = {}) ->
    opts = _.defaults opts,
        cap: false
        wdts: true

    if opts.cap is yes
        chai.use cap

    ret =
        'config':  config
        'chai':    chai
        'Browser': browser

    if opts.wdts is yes
        ret.suite = browser.useWdts()

    ret
