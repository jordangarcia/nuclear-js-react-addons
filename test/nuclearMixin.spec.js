import { Reactor, Store } from 'nuclear-js'
import expect from 'expect'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, nuclearMixin } from '../index'
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

describe('nuclearMixin', () => {
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

  describe('when no getDataBindings function is passed', () => {
    it('it should provide reactor as context', () => {
      let TestComponent = React.createClass({
        mixins: [nuclearMixin],

        componentDidMount() {
          expect(this.context.reactor).toEqual(reactor)
        },

        render() {
          return <div></div>
        },
      })

      mountTestComponent(reactor, <TestComponent />)
    })
  })

  describe('when a getDataBindings function is passed', () => {
    it('should provide initial values based on the state', () => {
      let TestComponent = React.createClass({
        mixins: [nuclearMixin],

        getDataBindings() {
          return {
            value1: ['store1'],
            value2: ['store2'],
          }
        },

        componentDidMount() {
          expect(this.state.value1).toEqual(1)
          expect(this.state.value2).toEqual(2)
        },

        render() {
          return <div></div>
        },
      })

      mountTestComponent(reactor, <TestComponent />)
    })

    it('should subscribe to updates', () => {
      let renderedValues = []
      let TestComponent = React.createClass({
        mixins: [nuclearMixin],

        getDataBindings() {
          return {
            value1: ['store1'],
          }
        },

        render() {
          renderedValues.push(this.state.value1)
          return <div></div>
        },
      })

      mountTestComponent(reactor, <TestComponent />)

      expect(renderedValues).toEqual([1])
      reactor.dispatch('increment1')
      expect(renderedValues).toEqual([1, 2])
      reactor.dispatch('otherAction')
      expect(renderedValues).toEqual([1, 2])
    })
  })
})
