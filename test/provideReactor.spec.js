import React, { PropTypes, Component } from 'react/addons'
import jsdomReact from './jsdomReact'
import provideReactor from '../provideReactor'
import 'should'

const { TestUtils } = React.addons

describe('provide reactor', () => {
  jsdomReact()

  class Child extends Component {
    static contextTypes = {
      reactor: PropTypes.object,
      i18n: PropTypes.string,
    }

    render() {
      return <div />
    }
  }

  const fakeReactor = {
    foo: 'bar',
  }

  it('should set displayName correctly', () => {
    @provideReactor
    class Foo extends Component {
      render() {
        return <div/>
      }
    }

    Foo.displayName.should.equal('ReactorProvider(Foo)')
  })

  it('should be useable as a decorator', () => {
    @provideReactor
    class Parent extends Component {
      render() {
        return <Child {...this.props} />
      }
    }

    const parent = TestUtils.renderIntoDocument(<Parent reactor={fakeReactor} pass="through" />)
    const child = TestUtils.findRenderedComponentWithType(parent, Child)
    child.props.pass.should.equal('through')
    child.context.reactor.should.equal(fakeReactor)
  })

  it('should send additional context types with decorator', () => {
    @provideReactor({i18n: PropTypes.string.isRequired})
    class Parent extends Component {
      render() {
        return <Child {...this.props} />
      }
    }

    const parent = TestUtils.renderIntoDocument(<Parent i18n='fr-FR' reactor={fakeReactor} pass="through" />)
    const child = TestUtils.findRenderedComponentWithType(parent, Child)
    child.props.pass.should.equal('through')
    child.context.reactor.should.equal(fakeReactor)
    child.context.i18n.should.equal('fr-FR')
  })
})
