import PropTypes from 'prop-types'

/**
 * Iterate on an object
 */
function each(obj, fn) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(obj[key], key)
    }
  }
}

/**
 * Returns a mapping of the getDataBinding keys to
 * the reactor values
 */
function getState(reactor, data) {
  var state = {}
  each(data, function(value, key) {
    state[key] = reactor.evaluate(value)
  })
  return state
}

/**
 * Mixin expecting a context.reactor on the component
 *
 * Should be used if a higher level component has been
 * wrapped with provideReactor
 * @type {Object}
 */
export default {
  contextTypes: {
    reactor: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    if (!this.getDataBindings) {
      return null
    }
    return getState(this.context.reactor, this.getDataBindings())
  },

  componentDidMount: function() {
    if (!this.getDataBindings) {
      return
    }
    var component = this
    component.__nuclearUnwatchFns = []
    each(this.getDataBindings(), function(getter, key) {
      var unwatchFn = component.context.reactor.observe(getter, function(val) {
        var newState = {}
        newState[key] = val
        component.setState(newState)
      })

      component.__nuclearUnwatchFns.push(unwatchFn)
    })
  },

  componentWillUnmount: function() {
    if (!this.__nuclearUnwatchFns) {
      return
    }
    while (this.__nuclearUnwatchFns.length) {
      this.__nuclearUnwatchFns.shift()()
    }
  },
}
