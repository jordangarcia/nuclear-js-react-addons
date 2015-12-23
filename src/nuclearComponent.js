import connect from './connect'

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
export default function nuclearComponent(Component, getDataBindings) {
  console.warn('nuclearComponent is deprecated, use `connect()` instead')
  // support decorator pattern
  // detect all React Components because they have a render method
  if (arguments.length === 0 || !Component.prototype.render) {
    // Component here is the getDataBindings Function
    return connect(Component)
  }

  return connect(getDataBindings)(Component)
}
