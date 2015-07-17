var React = require('react')
var hoistNonReactStatics = require('hoist-non-react-statics')
var objectAssign = require('object-assign')

function createComponent(Component, additionalContextTypes) {
  var componentName = Component.displayName || Component.name
  var childContextTypes = objectAssign({
    reactor: React.PropTypes.object.isRequired,
  }, additionalContextTypes || {})

  var ReactorProvider = React.createClass({
    displayName: 'ReactorProvider(' + componentName + ')',

    propTypes: {
      reactor: React.PropTypes.object.isRequired,
    },

    childContextTypes: childContextTypes,

    getChildContext: function() {
      var childContext = {
        reactor: this.props.reactor,
      }
      if (additionalContextTypes) {
        Object.keys(additionalContextTypes).forEach(function(key) {
          childContext[key] = this.props[key]
        }, this)
      }
      return childContext
    },

    render: function() {
      return React.createElement(Component, this.props)
    },
  })

  hoistNonReactStatics(ReactorProvider, Component)

  return ReactorProvider
}

/**
 * Provides reactor prop to all children as React context
 *
 * Example:
 *   var WrappedComponent = provideReactor(Component, {
 *     foo: React.PropTypes.string
 *   });
 *
 * Also supports the decorator pattern:
 *   @provideReactor({
 *     foo: React.PropTypes.string
 *   })
 *   class BaseComponent extends React.Component {
 *     render() {
 *       return <div/>;
 *     }
 *   }
 *
 * @method provideReactor
 * @param {React.Component} [Component] component to wrap
 * @param {object} additionalContextTypes Additional contextTypes to add
 * @returns {React.Component|Function} returns function if using decorator pattern
 */
module.exports = function provideReactor(Component, additionalContextTypes) {
  // support decorator pattern
  if (arguments.length === 0 || typeof arguments[0] !== 'function') {
    additionalContextTypes = arguments[0]
    return function connectToReactorDecorator(ComponentToDecorate) {
      return createComponent(ComponentToDecorate, additionalContextTypes)
    }
  }

  return createComponent.apply(null, arguments)
}
