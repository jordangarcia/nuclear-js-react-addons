import { Component, PropTypes, Children } from 'react'
import reactorShape from './reactorShape'

export default class Provider extends Component {
  getChildContext() {
    return {
      reactor: this.reactor,
    }
  }

  constructor(props, context) {
    super(props, context)
    this.reactor = props.reactor
  }

  render() {
    return Children.only(this.props.children)
  }
}

Provider.propTypes = {
  reactor: reactorShape.isRequired,
  children: PropTypes.element.isRequired,
}

Provider.childContextTypes = {
  reactor: reactorShape.isRequired,
}
