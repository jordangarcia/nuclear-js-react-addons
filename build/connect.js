'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = connect;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _reactorShape = require('./reactorShape');

var _reactorShape2 = _interopRequireDefault(_reactorShape);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function connect(mapStateToProps) {
  return function wrapWithConnect(WrappedComponent) {
    var Connect = (function (_Component) {
      _inherits(Connect, _Component);

      function Connect(props, context) {
        _classCallCheck(this, Connect);

        _Component.call(this, props, context);
        this.reactor = props.reactor || context.reactor;
        this.unsubscribeFns = [];
        this.updatePropMap(props);
      }

      Connect.prototype.resubscribe = function resubscribe(props) {
        this.unsubscribe();
        this.updatePropMap(props);
        this.updateState();
        this.subscribe();
      };

      Connect.prototype.componentWillMount = function componentWillMount() {
        this.updateState();
      };

      Connect.prototype.componentDidMount = function componentDidMount() {
        this.subscribe(this.props);
      };

      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
        this.unsubscribe();
      };

      Connect.prototype.updatePropMap = function updatePropMap(props) {
        this.propMap = mapStateToProps ? mapStateToProps(props) : {};
      };

      Connect.prototype.updateState = function updateState() {
        var propMap = this.propMap;
        var stateToSet = {};

        for (var key in propMap) {
          var getter = propMap[key];
          stateToSet[key] = this.reactor.evaluate(getter);
        }

        this.setState(stateToSet);
      };

      Connect.prototype.subscribe = function subscribe() {
        var _this = this;

        var propMap = this.propMap;

        var _loop = function (key) {
          var getter = propMap[key];
          var unsubscribeFn = _this.reactor.observe(getter, function (val) {
            var _setState;

            _this.setState((_setState = {}, _setState[key] = val, _setState));
          });

          _this.unsubscribeFns.push(unsubscribeFn);
        };

        for (var key in propMap) {
          _loop(key);
        }
      };

      Connect.prototype.unsubscribe = function unsubscribe() {
        if (this.unsubscribeFns.length === 0) {
          return;
        }

        while (this.unsubscribeFns.length > 0) {
          this.unsubscribeFns.shift()();
        }
      };

      Connect.prototype.render = function render() {
        return _react.createElement(WrappedComponent, _extends({
          reactor: this.reactor
        }, this.props, this.state));
      };

      return Connect;
    })(_react.Component);

    Connect.displayName = 'Connect(' + getDisplayName(WrappedComponent) + ')';
    Connect.WrappedComponent = WrappedComponent;
    Connect.contextTypes = {
      reactor: _reactorShape2['default']
    };
    Connect.propTypes = {
      reactor: _reactorShape2['default']
    };

    return _hoistNonReactStatics2['default'](Connect, WrappedComponent);
  };
}

module.exports = exports['default'];