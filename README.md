# selenium-webdriver-simple 
[![Build Status](https://travis-ci.org/cycloneapp/selenium-webdriver-simple.svg?branch=master)](https://travis-ci.org/cycloneapp/selenium-webdriver-simple)

WIP!

## How to
```coffee
Browser = require 'selenium-webdriver-simple'
config  =
    browser: 'chrome'     # could be any browser `selenium-webdriver` supports
    verbose: yes          # be verbose
    selenium:
        autostart: no     # don't run `selenium-server` automatically
        path: './vendor'  # path with `selenium-server-standalone`

browser = new Browser(config)
... 

```

## Caveats
* `selenium-server-standalone` must present in path defined in `config.selenium.path` option. Get it [here](http://selenium-release.storage.googleapis.com/index.html).
* `chromedriver` must present in `$PATH` in order to use Chrome/Chromium browser. Get it [here](http://chromedriver.storage.googleapis.com/index.html).
* `phantomjs` driver is kinda broken, so don't use it wich `mocha`

## Runtime
* `lib/browser` parses input config and passes `selenium` part to `lib/selenium` during initialize stage
* after `SeleniumServer` is initialized and running, `Browser` is ready to accept orders
* `Browser#quit` shutdowns both `Browser` and `SeleniumServer`

## Tests
Run `npm test`.

## TODO
* wrap `Browser#find` with `BrowserElement` class (or find another way) to be able to do advanced actions like finding the child elements 
* think about headless run with help of `Xvfb` OOB
* catch all exception thrown by `selenium-webdriver` to provide fallbacks
