Context =
    included: ->
        do =>
            [
                @::context
                @::_getContext
                @::_setContext
            ] = [
                {}
                -> @context
                (@context) -> @
            ]

module.exports = Context
