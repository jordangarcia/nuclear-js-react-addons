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

	exports.provideReactor = __webpack_require__(2)

	exports.nuclearMixin = __webpack_require__(6)

	exports.nuclearComponent = __webpack_require__(7)


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(3)
	var hoistNonReactStatics = __webpack_require__(4)
	var objectAssign = __webpack_require__(5)

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(3)

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

	/**
	 * Mixin expecting a context.reactor on the component
	 *
	 * Should be used if a higher level component has been
	 * wrapped with provideReactor
	 * @type {Object}
	 */
	module.exports = {
	  contextTypes: {
	    reactor: React.PropTypes.object.isRequired,
	  },

	  getInitialState: function() {
	    if (!this.getDataBindings) {
	      return null
	    }
	    return getState(this.context.reactor, this.getDataBindings())
	  },

	  componentDidMount: function() {
	    if (!this.getDataBindings) {
	      return
	    }
	    var component = this
	    component.__nuclearUnwatchFns = []
	    each(this.getDataBindings(), function(getter, key) {
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
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(3)
	var hoistNonReactStatics = __webpack_require__(4)
	var objectAssign = __webpack_require__(5)

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
	      component.__nuclearUnwatchFns = []
	      each(dataBindings, function(getter, key) {
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


/***/ }
/******/ ])
});
;