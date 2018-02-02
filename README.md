#NuclearJS addons for React

This is a fork of https://github.com/jordangarcia/nuclear-js-react-addons, with support for React v16.

---------------------------------------------------------------------------------------------------------

Addons to quickly help you start up with [React](https://github.com/facebook/react) using [NuclearJS](https://github.com/optimizely/nuclear-js), inspired by [react-redux](https://github.com/rackt/react-redux).

Provides NuclearJS `reactor` context via the `<Provider reactor={reactor} />` component and binds to getters via `connect` higher order component (or decorator).


## Install

`npm install --save nuclear-js-react-addons-chefsplate`

```javascript
// ES6
import {
  Provider,
  connect,
  nuclearMixin,
} from 'nuclear-js-react-addons-chefsplate'
```

```javascript
// ES5
var NuclearAddons = require('nuclear-js-react-addons-chefsplate')

var Provider = NuclearAddons.Provider;
var connect = NuclearAddons.connect;
var nuclearMixin = NuclearAddons.nuclearMixin;
```


## Documentation

### Provider

Container component allowing a `reactor` to be exposed via context.

Simple App

```javascript
// in a App.js file
class App extends React.Component {
  render() {
    <Provider reactor={reactor}>
      <SomeComponent />
    </Provider>
  }
}
```

Now the reactor is provided as the reactor key of the react context if you declare
```javascript
contextTypes: {
  reactor: React.propTypes.object.isRequired
}
```

which you won't have to do manually, because both a mixin and a component are available for you to use.

### connect
For usage with ES6 class syntax this Higher Order Component can be used as a decorator or as a javascript function.

Example using the decorator pattern:

```javascript
import { Component } from 'react'
import { getters } from './someModule';
import { connect } from 'nuclear-js-react-addons-chefsplate';

@connect(props => ({
  foo: getters.foo,
  bar: getters.bar,
})
export default class Child extends Component {
  render() {
    // get the reactor and your dataBindings
    // from the props passed in from the wrapper
    const {
      reactor,
      foo,
      bar
    } = this.props;

    return (
      <div>
        {foo}
        {bar}
      </div>
    )
  }
}
```

Or as a function

```javascript
import { Component } from 'react'
import { getters } from './someModule';
import { connect } from 'nuclear-js-react-addons-chefsplate';

class Child extends Component {
  render() {
    // get the reactor and your dataBindings
    // from the props passed in from the wrapper
    const {
      reactor,
      foo,
      bar
    } = this.props;

    return (
      <div>
        {foo}
        {bar}
      </div>
    )
  }
}

function mapStateToProps(props) {
  return {
    foo: getters.foo,
    bar: getters.bar,
  }
}

const ConnectedChild = connect(mapStateToProps)(Child)
export default ConnectedChild
```

### nuclearMixin

```javascript
import { nuclearMixin } from 'nuclear-js-react-addons-chefsplate'
import someNuclearModule from './someModule'
import someOtherNucModule from './someModule2'

// Component must be a descendent where `context.reactor` exists
var Child = React.createClass({
  mixins: [nuclearMixin],

  // you can omit this to simply have access to the reactor in the context
  getDataBindings() {
    return {
      foo: someNuclearModule.getters.meh,
      bar: someOtherNucModule.getters.whatever
    };
  },

  render() {
    // you can pass it to actions
    let reactor = this.context.reactor;
    // there is your data
    let foo = this.state.foo;
    let bar = this.state.bar;

    return (
      <div>
        {foo}
        </br>
        {bar}
      </div>
    );
  }
});
```


### provideReactor

*Deprecated in 0.3.0, use `<Provider reactor={reactor}>` instead*

Helper to help you provide your reactor to a react component tree using react contexts.

Simple App
```javascript
// in a App.js file
var App = React.createClass({
    render: function() {
        <Child/>
    }
});
```

elsewhere
```javascript
var Nuclear = require('nuclear-js');
var reactor = new Nuclear.Reactor();
var provideReactor = require('nuclear-js-react-addons-chefsplate').provideReactor;
// or
var provideReactor = require('nuclear-js-react-addons-chefsplate/provideReactor');
var App = require('./App');
// Wrap your App into a Higher order Component => HoC
var App = provideReactor(App);

// If you don't pass the reactor as a prop you will have a warning
React.render(<App reactor={reactor}/>, someDiv);
```

or decorator pattern (es7)

```javascript
@provideReactor
class App extends React.Component {
    render() {
        return <Child/>
    }
}
```


### nuclearComponent

*Deprecated in 0.3.0, use `connect()` instead*

If you prefer to stay away from mixin, there's also a nuclear component to suit your needs. It also support the decorator pattern

Example using the decorator pattern:
```javascript
import { getters } from './someModule';
import { nuclearComponent } from 'nuclear-js-react-addons-chefsplate';

@nuclearComponent((props) => {
    return {
        foo: getters.meh,
        bar: getters.haha
    };
})
class Child extends React.Component {
    render() {
        // get the reactor and your dataBindings
        // from the props passed in from the wrapper
        const {
            reactor,
            foo,
            bar
        } = this.props;

        return (
            <div>
                {foo}
                {bar}
            </div>
        )
    }
}
```

or simply still using es5
```javascript
var nuclearModule = require( './someModule');
var nuclearComponent = require('nuclear-js-react-addons-chefsplate').nuclearComponent;

var Child = React.createClass({
    render: function() {
        // get the reactor and your dataBindings
        // from the props passed in from the wrapper
        var reactor = this.props.reactor;
        var foo = this.props.foo;
        var bar = this.props.bar;

        return (
            <div>
                {foo}
                {bar}
            </div>
        )
    }
});

nuclearModule.exports = nuclearComponent(Child, function(props) {
    return {
        foo: nuclearModule.getters.meh,
        bar: nuclearModule.getters.haha
    };
});
```


##Examples

**Resubscribe to getters when props update**

This is possible by extending a `@connect` component.

```js
import { Component } from 'react'

@connect(props => ({
  value: ['store1', props.key]
}))
class NuclearComponent extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    <span>{this.props.value}</span>
  }
}
```

`this.props.value` will always be bound to the initial value of `this.props.key`, if we want a component that updates when props change we can simply extend it.

```js
class ResubscribingNuclearComponent extends NuclearComponent {
  constructor(props, context) {
    super(props, context)
  }

  componentWillReceiveProps(nextProps) {
    // any logic to check next props against current props can go here
    if (this.props.key !== nextProps.key) {
      this.resubscribe(nextProps);
    }
  }
}
```

Our `ResubscribingNuclearComponent` now rebinds all getters to the new props.

Additional [examples here](https://github.com/optimizely/nuclear-js/tree/master/examples/isomorphic-flux-chat)

##Tests

Run tests with karma via `npm test`

##Inspirations

Inspired/adapted from

  * [gaearon/redux](https://github.com/gaearon/redux)

  * [yahoo/fluxible-addons-react](https://github.com/yahoo/fluxible-addons-react)

Thanks to those for the help.
