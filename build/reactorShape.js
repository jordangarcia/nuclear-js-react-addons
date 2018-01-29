'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

exports['default'] = _propTypes2['default'].shape({
  dispatch: _propTypes2['default'].func.isRequired,
  evaluate: _propTypes2['default'].func.isRequired,
  evaluateToJS: _propTypes2['default'].func.isRequired,
  observe: _propTypes2['default'].func.isRequired
});
module.exports = exports['default'];