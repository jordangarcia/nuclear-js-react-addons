import { Reactor } from 'nuclear-js'
import expect from 'expect'
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { provideReactor } from '../index'
import setup from './setup'

describe('provideReactor', () => {
  setup()

  describe('when used as a function', () => {
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
        reactor: PropTypes.object.isRequired,
      }

      class TestComponent extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        render() {
          return <Child />
        }
      }

      var ReactoredTestComponent = provideReactor(TestComponent)
      ReactDOM.render(<ReactoredTestComponent reactor={reactor} />, document.getElementById('test-root'))
    })

    it('should allow additional context to be passed through', (done) => {
      var reactor = new Reactor()
      var additionalContextTypes = {
        foo: PropTypes.string.isRequired,
        bar: PropTypes.string.isRequired,
      }

      class Child extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        componentDidMount() {
          expect(this.context.reactor).toEqual(reactor)
          expect(this.context.foo).toEqual('foo')
          expect(this.context.bar).toEqual('bar')
          done()
        }

        render() {
          return <div></div>
        }
      }

      Child.contextTypes = {
        reactor: PropTypes.object.isRequired,
        foo: PropTypes.string.isRequired,
        bar: PropTypes.string.isRequired,
      }

      class TestComponent extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        render() {
          return <Child />
        }
      }

      var ReactoredTestComponent = provideReactor(TestComponent, additionalContextTypes)
      ReactDOM.render(<ReactoredTestComponent reactor={reactor} foo="foo" bar="bar" />, document.getElementById('test-root'))
    })
  })

  describe('when used as a decorator', () => {
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
        reactor: PropTypes.object.isRequired,
      }

      @provideReactor()
      class TestComponent extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        render() {
          return <Child />
        }
      }

      ReactDOM.render(<TestComponent reactor={reactor} />, document.getElementById('test-root'))
    })

    it('should allow additional context to be passed through', (done) => {
      var reactor = new Reactor()

      class Child extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        componentDidMount() {
          expect(this.context.reactor).toEqual(reactor)
          expect(this.context.foo).toEqual('foo')
          expect(this.context.bar).toEqual('bar')
          done()
        }

        render() {
          return <div></div>
        }
      }

      Child.contextTypes = {
        reactor: PropTypes.object.isRequired,
        foo: PropTypes.string.isRequired,
        bar: PropTypes.string.isRequired,
      }

      @provideReactor({
        foo: PropTypes.string.isRequired,
        bar: PropTypes.string.isRequired,
      })
      class TestComponent extends React.Component {
        constructor(props, context) {
          super(props, context)
        }

        render() {
          return <Child />
        }
      }

      ReactDOM.render(<TestComponent reactor={reactor} foo="foo" bar="bar" />, document.getElementById('test-root'))
    })
  })
})
