'use strict';

exports.__esModule = true;
exports['default'] = provideReactor;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function createComponent(Component, additionalContextTypes) {
  var componentName = Component.displayName || Component.name;
  var childContextTypes = _objectAssign2['default']({
    reactor: _react2['default'].PropTypes.object.isRequired
  }, additionalContextTypes || {});

  var ReactorProvider = _react2['default'].createClass({
    displayName: 'ReactorProvider(' + componentName + ')',

    propTypes: {
      reactor: _react2['default'].PropTypes.object.isRequired
    },

    childContextTypes: childContextTypes,

    getChildContext: function getChildContext() {
      var childContext = {
        reactor: this.props.reactor
      };
      if (additionalContextTypes) {
        Object.keys(additionalContextTypes).forEach(function (key) {
          childContext[key] = this.props[key];
        }, this);
      }
      return childContext;
    },

    render: function render() {
      return _react2['default'].createElement(Component, this.props);
    }
  });

  _hoistNonReactStatics2['default'](ReactorProvider, Component);

  return ReactorProvider;
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

function provideReactor(Component, additionalContextTypes) {
  console.warn('`provideReactor` is deprecated, use `<Provider reactor={reactor} />` instead');
  // support decorator pattern
  if (arguments.length === 0 || typeof arguments[0] !== 'function') {
    additionalContextTypes = arguments[0];
    return function connectToReactorDecorator(ComponentToDecorate) {
      return createComponent(ComponentToDecorate, additionalContextTypes);
    };
  }

  return createComponent.apply(null, arguments);
}

module.exports = exports['default'];