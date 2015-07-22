import React from 'react/addons'
import jsdomReact from './jsdomReact'
import nuclearMixin from '../nuclearMixin'
import provideReactor from '../provideReactor'
import 'should'

const { TestUtils } = React.addons

describe('react mixin', () => {
  jsdomReact()

  it('should not throw on mount if no dataBindings', () => {
    const Component = React.createClass({
      mixins: [nuclearMixin],

      render() {
        return <div/>
      },
    })

    const fakeReactor = {
      foo: 'bar',
    }

    const WrappedComponent = provideReactor(Component)
    const wrappedComponent = TestUtils.renderIntoDocument(<WrappedComponent reactor={fakeReactor}/>)
    const component = TestUtils.findRenderedComponentWithType(wrappedComponent, Component)
    component.context.reactor.should.equal(fakeReactor)
  })

  describe('mounting flow', () => {
    const Component = React.createClass({
      mixins: [nuclearMixin],

      getDataBindings() {
        return {
          count: 'count',
          foor: 'bar',
        }
      },

      render() {
        return <div/>
      },
    })

    let div
    let wrappedComponent
    let component

    let evaluateCalls = 0
    let observeCalls = 0
    let unwatchCalls = 0

    it('should call getState if dataBindings', () => {
      div = document.createElement('div')

      const fakeReactor = {
        evaluate() {
          ++evaluateCalls
        },
        observe() {
          ++observeCalls
          return () => {
            ++unwatchCalls
          }
        },
      }

      const WrappedComponent = provideReactor(Component)
      wrappedComponent = React.render(<WrappedComponent reactor={fakeReactor}/>, div)
      component = TestUtils.findRenderedComponentWithType(wrappedComponent, Component)
      component.context.reactor.should.equal(fakeReactor)
      evaluateCalls.should.equal(2)
      observeCalls.should.equal(2)
      unwatchCalls.should.equal(0)
      component.__nuclearUnwatchFns.length.should.equal(2)
    })

    it('should properly unwatch when unmounting', () => {
      React.unmountComponentAtNode(div)
      evaluateCalls.should.equal(2)
      observeCalls.should.equal(2)
      unwatchCalls.should.equal(2)
      component.__nuclearUnwatchFns.length.should.equal(0)
    })
  })

  it('should not throw when unmounting if no dataBindings', () => {
    const div = document.createElement('div')

    const fakeReactor = {
      foo: 'bar',
    }

    let NoBindings = React.createClass({
      mixins: [nuclearMixin],

      render() {
        return <div/>
      },
    })

    NoBindings = provideReactor(NoBindings)

    React.render(<NoBindings reactor={fakeReactor}/>, div)
    React.unmountComponentAtNode(div)
  })
})
