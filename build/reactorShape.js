'use strict';

exports.__esModule = true;

var _react = require('react');

exports['default'] = _react.PropTypes.shape({
  dispatch: _react.PropTypes.func.isRequired,
  evaluate: _react.PropTypes.func.isRequired,
  evaluateToJS: _react.PropTypes.func.isRequired,
  observe: _react.PropTypes.func.isRequired
});
module.exports = exports['default'];