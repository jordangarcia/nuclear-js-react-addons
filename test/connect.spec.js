import { Reactor, Store } from 'nuclear-js'
import expect from 'expect'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from '../src/index'
import setup from './setup'

function mountTestComponent(reactor, children) {
  class TestComponent extends React.Component {
    constructor(props, context) {
      super(props, context)
    }

    render() {
      return <Provider reactor={reactor}>{children}</Provider>
    }
  }
  ReactDOM.render(<TestComponent />, document.getElementById('test-root'))

}

describe('connect', () => {
  setup()

  let reactor
  beforeEach(() => {
    reactor = new Reactor()
    reactor.registerStores({
      store1: Store({
        getInitialState: () => 1,
        initialize() {
          this.on('increment1', state => state + 1)
        },
      }),
      store2: Store({
        getInitialState: () => 2,
        initialize() {
          this.on('increment1', state => state + 1)
        },
      }),
    })
  })

  describe('when no mapStateToProps function is passed', () => {
    it('it should provide reactor as a prop', () => {
      class Child extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        componentDidMount() {
          expect(this.props.reactor).toEqual(reactor)
        }

        render() {
          return <div></div>
        }
      }

      let ReactoredChild = connect()(Child)

      mountTestComponent(reactor, <ReactoredChild />)
    })
  })

  describe('when a mapStateToProps function is passed', () => {
    it('should provide initial values based on the state', () => {
      class Child extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        componentDidMount() {
          expect(this.props.value1).toEqual(1)
          expect(this.props.value2).toEqual(2)
        }

        render() {
          return <div></div>
        }
      }

      let ReactoredChild = connect(props => ({
        value1: ['store1'],
        value2: ['store2'],
      }))(Child)

      mountTestComponent(reactor, <ReactoredChild />)
    })

    it('should subscribe to updates', () => {
      let renderedValues = []

      class Child extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        render() {
          renderedValues.push(this.props.value1)
          return <div></div>
        }
      }

      let ReactoredChild = connect(props => ({
        value1: ['store1'],
      }))(Child)

      mountTestComponent(reactor, <ReactoredChild />)

      expect(renderedValues).toEqual([1])

      reactor.dispatch('increment1')
      expect(renderedValues).toEqual([1, 2])
      reactor.dispatch('otherAction')
      expect(renderedValues).toEqual([1, 2])
    })

    it('should rebind subscriptions when a prop changes', () => {
      let renderedValues = []

      class Child extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        render() {
          renderedValues.push(this.props.value)
          return <div></div>
        }
      }

      let ReactoredChild = connect(props => {
        return {
          value: [props.propValue],
        }
      })(Child)

      class ResubscribingChild extends ReactoredChild {
        constructor(props, context) {
          super(props, context)
        }

        componentWillReceiveProps(nextProps) {
          this.resubscribe(nextProps)
        }
      }


      let setPropValue
      class TestComponent extends React.Component {
        state = {
          propValue: 'store1',
        }

        constructor(props, context) {
          super(props, context)
        }

        componentWillMount() {
          setPropValue = (val) => {
            this.setState({ propValue: val })
          }
        }

        render() {
          return <Provider reactor={reactor}><ResubscribingChild propValue={this.state.propValue} /></Provider>
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('test-root'))

      expect(renderedValues).toEqual([1])
      setPropValue('store2')
      expect(renderedValues).toEqual([1, 2])
      reactor.dispatch('increment1')
      reactor.dispatch('increment2')
      expect(renderedValues).toEqual([1, 2, 3])
    })
  })

  describe('when used as a decorator', () => {
    it('it should provide reactor as a prop', () => {
      @connect()
      class Child extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        componentDidMount() {
          expect(this.props.reactor).toEqual(reactor)
        }

        render() {
          return <div></div>
        }
      }

      mountTestComponent(reactor, <Child />)
    })

    it('should subscribe to updates', () => {
      let renderedValues = []

      @connect(props => ({
        value1: ['store1'],
      }))
      class Child extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        render() {
          renderedValues.push(this.props.value1)
          return <div></div>
        }
      }

      class ResubscribingChild extends Child {
        constructor(props, state) {
          super(props, state)
        }
        componentWillReceiveProps(nextProps) {
          this.resubscribe()
        }
      }

      mountTestComponent(reactor, <ResubscribingChild />)

      expect(renderedValues).toEqual([1])

      reactor.dispatch('increment1')
      expect(renderedValues).toEqual([1, 2])
      reactor.dispatch('otherAction')
      expect(renderedValues).toEqual([1, 2])
    })

  })
})
