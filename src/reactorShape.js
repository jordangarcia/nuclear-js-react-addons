import PropTypes from 'prop-types'

export default PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  evaluate: PropTypes.func.isRequired,
  evaluateToJS: PropTypes.func.isRequired,
  observe: PropTypes.func.isRequired,
})
