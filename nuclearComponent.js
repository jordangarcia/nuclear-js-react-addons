var React = require('react')
var hoistNonReactStatics = require('hoist-non-react-statics')
var objectAssign = require('object-assign')

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

function createComponent(Component, dataBindings) {
  var componentName = Component.displayName || Component.name

  var NuclearComponent = React.createClass({
    displayName: 'NuclearComponent(' + componentName + ')',

    contextTypes: {
      reactor: React.PropTypes.object.isRequired,
    },

    getInitialState: function() {
      if (!dataBindings) {
        return null
      }
      return getState(this.context.reactor, dataBindings)
    },

    componentDidMount: function() {
      if (!dataBindings) {
        return
      }
      var component = this
      component.__unwatchFns = []
      each(dataBindings, function(getter, key) {
        var unwatchFn = component.context.reactor.observe(getter, function(val) {
          var newState = {}
          newState[key] = val
          component.setState(newState)
        })

        component.__unwatchFns.push(unwatchFn)
      })
    },

    componentWillUnmount: function() {
      while (this.__unwatchFns.length) {
        this.__unwatchFns.shift()()
      }
    },

    render: function() {
      return React.createElement(Component, objectAssign({}, this.props, this.state, this.context))
    },
  })

  hoistNonReactStatics(NuclearComponent, Component)

  return NuclearComponent
}

/**
 * Provides dataBindings + reactor
 * as props to wrapped component
 *
 * Example:
 *   var WrappedComponent = nuclearComponent(Component, {
 *     counter: 'counter'
 *   });
 *
 * Also supports the decorator pattern:
 *   @nuclearComponent({
 *     counter: 'counter'
 *   })
 *   class BaseComponent extends React.Component {
 *     render() {
 *       const { counter, reactor } = this.props;
 *       return <div/>;
 *     }
 *   }
 *
 * @method nuclearComponent
 * @param {React.Component} [Component] component to wrap
 * @param {object} dataBindings dataBindings to listen to data change
 * @returns {React.Component|Function} returns function if using decorator pattern
 */
module.exports = function nuclearComponent(Component, dataBindings) {
  // support decorator pattern
  if (arguments.length === 0 || typeof arguments[0] !== 'function') {
    dataBindings = arguments[0]
    return function connectToData(ComponentToDecorate) {
      return createComponent(ComponentToDecorate, dataBindings)
    }
  }

  return createComponent.apply(null, arguments)
}
