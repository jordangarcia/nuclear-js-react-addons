'use strict';

exports.__esModule = true;
exports['default'] = nuclearComponent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

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

function nuclearComponent(Component, getDataBindings) {
  console.warn('nuclearComponent is deprecated, use `connect()` instead');
  // support decorator pattern
  // detect all React Components because they have a render method
  if (arguments.length === 0 || !Component.prototype.render) {
    // Component here is the getDataBindings Function
    return _connect2['default'](Component);
  }

  return _connect2['default'](getDataBindings)(Component);
}

module.exports = exports['default'];