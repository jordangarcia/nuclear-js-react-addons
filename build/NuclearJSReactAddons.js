(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["NuclearJSReactAddons"] = factory(require("react"));
	else
		root["NuclearJSReactAddons"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _srcConnect = __webpack_require__(2);

	var _srcConnect2 = _interopRequireDefault(_srcConnect);

	var _srcProvider = __webpack_require__(6);

	var _srcProvider2 = _interopRequireDefault(_srcProvider);

	exports['default'] = {
	  connect: _srcConnect2['default'],
	  Provider: _srcProvider2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = connect;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(3);

	var _reactorShape = __webpack_require__(4);

	var _reactorShape2 = _interopRequireDefault(_reactorShape);

	var _hoistNonReactStatics = __webpack_require__(5);

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
	      }

	      Connect.prototype.componentWillMount = function componentWillMount() {
	        this.subscribe(this.props);
	      };

	      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
	        this.unsubscribe();
	      };

	      Connect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	        this.subscribe(nextProps);
	      };

	      Connect.prototype.subscribe = function subscribe(props) {
	        var _this = this;

	        this.unsubscribe();
	        if (!mapStateToProps) {
	          return;
	        }

	        var propMap = mapStateToProps(props);
	        var stateToSet = {};

	        var _loop = function (key) {
	          var getter = propMap[key];
	          var unsubscribeFn = _this.reactor.observe(getter, function (val) {
	            var _setState;

	            _this.setState((_setState = {}, _setState[key] = val, _setState));
	          });

	          _this.unsubscribeFns.push(unsubscribeFn);

	          stateToSet[key] = _this.reactor.evaluate(getter);
	        };

	        for (var key in propMap) {
	          _loop(key);
	        }

	        this.setState(stateToSet);
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _react = __webpack_require__(3);

	exports['default'] = _react.PropTypes.shape({
	  dispatch: _react.PropTypes.func.isRequired,
	  evaluate: _react.PropTypes.func.isRequired,
	  evaluateToJS: _react.PropTypes.func.isRequired,
	  observe: _react.PropTypes.func.isRequired
	});
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Copyright 2015, Yahoo! Inc.
	 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	 */
	'use strict';

	var REACT_STATICS = {
	    childContextTypes: true,
	    contextTypes: true,
	    defaultProps: true,
	    displayName: true,
	    getDefaultProps: true,
	    mixins: true,
	    propTypes: true,
	    type: true
	};

	module.exports = function hoistNonReactStatics(targetComponent, sourceComponent) {
	    var keys = Object.keys(sourceComponent);
	    for (var i=0; i<keys.length; ++i) {
	        if (!REACT_STATICS[keys[i]]) {
	            targetComponent[keys[i]] = sourceComponent[keys[i]];
	        }
	    }

	    return targetComponent;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(3);

	var _reactorShape = __webpack_require__(4);

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
	  children: _react.PropTypes.element.isRequired
	};
	Provider.childContextTypes = {
	  reactor: _reactorShape2['default'].isRequired
	};
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;