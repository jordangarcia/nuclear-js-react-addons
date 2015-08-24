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

function createComponent(Component, getDataBindings) {
  var componentName = Component.displayName || Component.name

  var NuclearComponent = React.createClass({
    displayName: 'NuclearComponent(' + componentName + ')',

    contextTypes: {
      reactor: React.PropTypes.object.isRequired,
    },

    getInitialState: function() {
      if (!getDataBindings) {
        return null
      }
      return getState(this.context.reactor, getDataBindings(this.props))
    },

    componentDidMount: function() {
      if (!getDataBindings) {
        return
      }
      var component = this
      component.__nuclearUnwatchFns = []
      each(getDataBindings(this.props), function(getter, key) {
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
 *   var WrappedComponent = nuclearComponent(Component, function(props) {
 *     return { counter: 'counter' };
 *   );
 *
 * Also supports the decorator pattern:
 *   @nuclearComponent((props) => {
 *     return { counter: 'counter' }
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
 * @param {Function} getDataBindings function which returns dataBindings to listen for data change
 * @returns {React.Component|Function} returns function if using decorator pattern
 */
module.exports = function nuclearComponent(Component, getDataBindings) {
  // support decorator pattern
  // detect all React Components because they have a render method
  if (arguments.length === 0 || !Component.prototype.render) {
    // Component here is the getDataBindings Function
    return function connectToData(ComponentToDecorate) {
      return createComponent(ComponentToDecorate, Component)
    }
  }

  return createComponent.apply(null, arguments)
}
