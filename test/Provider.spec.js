import { Reactor } from 'nuclear-js'
import expect from 'expect'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from '../index'
import setup from './setup'

describe('Provider', () => {
  setup()

  it('should provide reactor context to children', (done) => {
    var reactor = new Reactor()

    class Child extends React.Component {
      constructor(props, context) {
        super(props, context)
      }

      componentDidMount() {
        expect(this.context.reactor).toEqual(reactor)
        done()
      }

      render() {
        return <div></div>
      }
    }

    Child.contextTypes = {
      reactor: null,
    }

    class TestComponent extends React.Component {
      constructor(props, context) {
        super(props, context)
      }

      render() {
        return <Provider reactor={reactor} ><Child /></Provider>
      }
    }
    ReactDOM.render(<TestComponent />, document.getElementById('test-root'))
  })
})
