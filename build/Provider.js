'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactorShape = require('./reactorShape');

var _reactorShape2 = _interopRequireDefault(_reactorShape);

var Provider = (function (_Component) {
  _inherits(Provider, _Component);

  Provider.prototype.getChildContext = function getChildContext() {
    return {
      reactor: this.reactor
    };
  };

  function Provider(props, context) {
    _classCallCheck(this, Provider);

    _Component.call(this, props, context);
    this.reactor = props.reactor;
  }

  Provider.prototype.render = function render() {
    return _react.Children.only(this.props.children);
  };

  return Provider;
})(_react.Component);

exports['default'] = Provider;

Provider.propTypes = {
  reactor: _reactorShape2['default'].isRequired,
  children: _propTypes2['default'].element.isRequired
};

Provider.childContextTypes = {
  reactor: _reactorShape2['default'].isRequired
};
module.exports = exports['default'];