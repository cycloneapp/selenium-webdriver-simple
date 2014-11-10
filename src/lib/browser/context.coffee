Context =
    included: ->
        do =>
            [
                @::_context
                @::_getContext
                @::_setContext
            ] = [
                {}
                -> @_context
                (@_context) -> 
                    @info 'context changed'
                    @
            ]

module.exports = Context
