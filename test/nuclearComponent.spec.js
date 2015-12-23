import { Reactor, Store } from 'nuclear-js'
import expect from 'expect'
import React from 'react'
import ReactDOM from 'react-dom'
import { provideReactor, nuclearComponent } from '../index'
import setup from './setup'

function mountTestComponent(reactor, children) {
  @provideReactor()
  class TestComponent extends React.Component {
    constructor(props, context) {
      super(props, context)
    }

    render() {
      return <div>{children}</div>
    }
  }

  ReactDOM.render(<TestComponent reactor={reactor} />, document.getElementById('test-root'))
}

describe('nuclearComponent', () => {
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
          this.on('increment2', state => state + 1)
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

      let ReactoredChild = nuclearComponent(Child)

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

      let ReactoredChild = nuclearComponent(Child, props => ({
        value1: ['store1'],
        value2: ['store2'],
      }))

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

      let ReactoredChild = nuclearComponent(Child, props => ({
        value1: ['store1'],
      }))

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

      let ReactoredChild = nuclearComponent(Child, props => {
        return {
          value: [props.propValue],
        }
      })

      let setPropValue
      @provideReactor()
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
          return <ReactoredChild propValue={this.state.propValue} />
        }
      }
      ReactDOM.render(<TestComponent reactor={reactor} />, document.getElementById('test-root'))

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
      @nuclearComponent()
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

      @nuclearComponent(props => ({
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

      mountTestComponent(reactor, <Child />)

      expect(renderedValues).toEqual([1])

      reactor.dispatch('increment1')
      expect(renderedValues).toEqual([1, 2])
      reactor.dispatch('otherAction')
      expect(renderedValues).toEqual([1, 2])
    })

  })
})
