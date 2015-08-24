import React, { Component, createClass } from 'react/addons'
import jsdomReact from './jsdomReact'
import provideReactor from '../provideReactor'
import nuclearComponent from '../nuclearComponent'
import should from 'should'

const { TestUtils } = React.addons

describe('nuclear component', () => {
  jsdomReact()

  class Child extends Component {
    render() {
      return <div/>
    }
  }

  describe('mount flow', () => {
    let fakeReactor
    let evaluateCalls = 0
    let observeCalls = 0
    let unwatchCalls = 0
    let parent

    let div

    before(() => {
      fakeReactor = {
        evaluate(key) {
          ++evaluateCalls
          return key
        },
        observe() {
          ++observeCalls
          return () => {
            ++unwatchCalls
          }
        },
      }
    })

    after(() => {
      evaluateCalls = observeCalls = unwatchCalls = 0
    })

    it('should provide bindings as props on mount', () => {
      @provideReactor
      @nuclearComponent(() => {
        return { foo: 'bar', test: 'lol'}
      })
      class Parent extends Component {
        render() {
          return <Child {...this.props}/>
        }
      }

      div = document.createElement('div')

      parent = React.render(<Parent pass='through' reactor={fakeReactor}/>, div)
      const child = TestUtils.findRenderedComponentWithType(parent, Child)
      parent.props.reactor.should.equal(fakeReactor)
      parent.props.pass.should.equal('through')
      evaluateCalls.should.equal(2)
      observeCalls.should.equal(2)
      unwatchCalls.should.equal(0)
      child.props.foo.should.equal('bar')
      child.props.test.should.equal('lol')

      Parent.displayName.should.equal('ReactorProvider(NuclearComponent(Parent))')
    })

    it('should correctly unmount', () => {
      React.unmountComponentAtNode(div)
      evaluateCalls.should.equal(2)
      observeCalls.should.equal(2)
      unwatchCalls.should.equal(2)
    })
  })

  it('should not throw if we do not send dataBindings', () => {
    @provideReactor
    @nuclearComponent
    class Parent extends Component {
      render() {
        return <Child {...this.props}/>
      }
    }

    const fakeReactor = {
      evaluate() {},
      observe() {
        return () => {}
      },
    }

    should.doesNotThrow(() => {
      TestUtils.renderIntoDocument(<Parent reactor={fakeReactor}/>)
    })
  })

  it('should provide the reactor as prop', () => {
    let innerChild2

    // this wraps Child2
    @nuclearComponent
    class Child2 extends Component {
      render() {
        innerChild2 = this
        return <div/>
      }
    }

    class Child1 extends Component {
      render() {
        return <Child2/>
      }
    }

    @provideReactor
    class App extends Component {
      render() {
        return <Child1/>
      }
    }

    const fakeReactor = {
      evaluate() {},
      observe() {
        return () => {}
      },
    }

    const app = TestUtils.renderIntoDocument(<App reactor={fakeReactor} />)
    app.props.reactor.should.equal(fakeReactor)
    const child1 = TestUtils.findRenderedComponentWithType(app, Child1)
    const wrappedChild2 = TestUtils.findRenderedComponentWithType(app, Child2)
    should.not.exist(child1.context.reactor)
    wrappedChild2.context.reactor.should.equal(fakeReactor)
    innerChild2.props.reactor.should.equal(fakeReactor)
  })

  it('should not throw when unmounting if no dataBindings', () => {
    const div = document.createElement('div')

    const fakeReactor = {
      foo: 'bar',
    }

    @provideReactor
    @nuclearComponent
    class NoBindings extends Component {
      render() {
        return <div/>
      }
    }

    React.render(<NoBindings reactor={fakeReactor}/>, div)
    React.unmountComponentAtNode(div)
  })

  it('should not throw when using es5', () => {
    const div = document.createElement('div')

    const fakeReactor = {
      evaluate() {},
      observe() {
        return () => {}
      },
    }

    let SomeES5Stuff = createClass({
      render() {
        return <div/>
      },
    })

    SomeES5Stuff = nuclearComponent(SomeES5Stuff, function() {
      return { pass: 'through' }
    })
    SomeES5Stuff = provideReactor(SomeES5Stuff)

    React.render(<SomeES5Stuff reactor={fakeReactor}/>, div)
    React.unmountComponentAtNode(div)
  })

  it('should provide access to the props easily', () => {
    const div = document.createElement('div')

    const fakeReactor = {
      evaluate(key) {
        if (key !== 'through1337') {
          throw new Error('wrong key')
        }
      },
      observe() {
        return () => {}
      },
    }

    let SomeES5Stuff = createClass({
      render() {
        return <div/>
      },
    })

    SomeES5Stuff = nuclearComponent(SomeES5Stuff, function(props) {
      return { pass: 'through' + props.foo }
    })
    SomeES5Stuff = provideReactor(SomeES5Stuff)

    React.render(<SomeES5Stuff foo="1337" reactor={fakeReactor}/>, div)
    React.unmountComponentAtNode(div)
  })
})
