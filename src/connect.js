import { Component, createElement } from 'react'
import reactorShape from './reactorShape'
import hoistStatics from 'hoist-non-react-statics'


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default function connect(mapStateToProps) {
  return function wrapWithConnect(WrappedComponent) {
    class Connect extends Component {
      constructor(props, context) {
        super(props, context)
        this.reactor = props.reactor || context.reactor
        this.unsubscribeFn = null
        this.updatePropMap(props)
      }

      resubscribe(props) {
        this.unsubscribe()
        this.updatePropMap(props)
        this.updateState()
        this.subscribe()
      }

      componentWillMount() {
        this.updateState()
      }

      componentDidMount() {
        this.subscribe(this.props)
      }

      componentWillUnmount() {
        this.unsubscribe()
      }

      updatePropMap(props) {
        this.propMap = (mapStateToProps) ? mapStateToProps(props) : {}
      }

      updateState() {
        const propMap = this.propMap
        const stateToSet = {}

        for (let key in propMap) {
          const getter = propMap[key]
          stateToSet[key] = this.reactor.evaluate(getter)
        }

        this.setState(stateToSet)
      }

      subscribe() {
        const propMap = this.propMap
        const keys = Object.keys(propMap)
        const getters = keys.map(k => propMap[k])

        // Add a final function to the getter to aggregate results in an array
        getters.push((...vals) => vals)

        this.unsubscribeFn = this.reactor.observe(getters, (vals) => {
          const newState = vals.reduce((state, val, i) => {
            state[keys[i]] = val
            return state
          }, {})

          this.setState(newState)
        })
      }

      unsubscribe() {
        if (this.unsubscribeFn) {
          this.unsubscribeFn()
        }
      }

      render() {
        return createElement(WrappedComponent, {
          reactor: this.reactor,
          ...this.props,
          ...this.state,
        })
      }
    }

    Connect.displayName = `Connect(${getDisplayName(WrappedComponent)})`
    Connect.WrappedComponent = WrappedComponent
    Connect.contextTypes = {
      reactor: reactorShape,
    }
    Connect.propTypes = {
      reactor: reactorShape,
    }

    return hoistStatics(Connect, WrappedComponent)
  }
}

