(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["NuclearJSReactAddons"] = factory(require("react"));
	else
		root["NuclearJSReactAddons"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
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

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _connect = __webpack_require__(1);

	var _connect2 = _interopRequireDefault(_connect);

	var _Provider = __webpack_require__(5);

	var _Provider2 = _interopRequireDefault(_Provider);

	var _nuclearMixin = __webpack_require__(6);

	var _nuclearMixin2 = _interopRequireDefault(_nuclearMixin);

	var _provideReactor = __webpack_require__(7);

	var _provideReactor2 = _interopRequireDefault(_provideReactor);

	var _nuclearComponent = __webpack_require__(9);

	var _nuclearComponent2 = _interopRequireDefault(_nuclearComponent);

	exports.connect = _connect2['default'];
	exports.Provider = _Provider2['default'];
	exports.nuclearMixin = _nuclearMixin2['default'];
	exports.provideReactor = _provideReactor2['default'];
	exports.nuclearComponent = _nuclearComponent2['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = connect;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _reactorShape = __webpack_require__(3);

	var _reactorShape2 = _interopRequireDefault(_reactorShape);

	var _hoistNonReactStatics = __webpack_require__(4);

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

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _react = __webpack_require__(2);

	exports['default'] = _react.PropTypes.shape({
	  dispatch: _react.PropTypes.func.isRequired,
	  evaluate: _react.PropTypes.func.isRequired,
	  evaluateToJS: _react.PropTypes.func.isRequired,
	  observe: _react.PropTypes.func.isRequired
	});
	module.exports = exports['default'];

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _reactorShape = __webpack_require__(3);

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _react = __webpack_require__(2);

	/**
	 * Iterate on an object
	 */
	function each(obj, fn) {
	  for (var key in obj) {
	    if (obj.hasOwnProperty(key)) {
	      fn(obj[key], key);
	    }
	  }
	}

	/**
	 * Returns a mapping of the getDataBinding keys to
	 * the reactor values
	 */
	function getState(reactor, data) {
	  var state = {};
	  each(data, function (value, key) {
	    state[key] = reactor.evaluate(value);
	  });
	  return state;
	}

	/**
	 * Mixin expecting a context.reactor on the component
	 *
	 * Should be used if a higher level component has been
	 * wrapped with provideReactor
	 * @type {Object}
	 */
	exports['default'] = {
	  contextTypes: {
	    reactor: _react.PropTypes.object.isRequired
	  },

	  getInitialState: function getInitialState() {
	    if (!this.getDataBindings) {
	      return null;
	    }
	    return getState(this.context.reactor, this.getDataBindings());
	  },

	  componentDidMount: function componentDidMount() {
	    if (!this.getDataBindings) {
	      return;
	    }
	    var component = this;
	    component.__nuclearUnwatchFns = [];
	    each(this.getDataBindings(), function (getter, key) {
	      var unwatchFn = component.context.reactor.observe(getter, function (val) {
	        var newState = {};
	        newState[key] = val;
	        component.setState(newState);
	      });

	      component.__nuclearUnwatchFns.push(unwatchFn);
	    });
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    if (!this.__nuclearUnwatchFns) {
	      return;
	    }
	    while (this.__nuclearUnwatchFns.length) {
	      this.__nuclearUnwatchFns.shift()();
	    }
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = provideReactor;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _hoistNonReactStatics = __webpack_require__(4);

	var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

	var _objectAssign = __webpack_require__(8);

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

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function ownEnumerableKeys(obj) {
		var keys = Object.getOwnPropertyNames(obj);

		if (Object.getOwnPropertySymbols) {
			keys = keys.concat(Object.getOwnPropertySymbols(obj));
		}

		return keys.filter(function (key) {
			return propIsEnumerable.call(obj, key);
		});
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = ownEnumerableKeys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = nuclearComponent;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _connect = __webpack_require__(1);

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

/***/ }
/******/ ])
});
;