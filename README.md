#NuclearJS addons for React

Addons to quickly help you start up with [React](https://github.com/facebook/react) using [NuclearJS](https://github.com/optimizely/nuclear-js), inspired by [react-redux](https://github.com/rackt/react-redux).

Provides NuclearJS `reactor` context via the `<Provider reactor={reactor} />` component and binds to getters via `connect` higher order component (or decorator).


## Install

`npm install --save nuclear-js-react-addons`

```javascript
// ES6
import {
  Provider,
  connect,
  nuclearMixin,
} from 'nuclear-js-react-addons'
```

```javascript
// ES5
var NuclearAddons = require('nuclear-js-react-addons')

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
import { connect } from 'nuclear-js-react-addons';

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
import { connect } from 'nuclear-js-react-addons';

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
import { nuclearMixin } from 'nuclear-js-react-addons'
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


##Examples

Additional [examples here](https://github.com/optimizely/nuclear-js/tree/master/examples/isomorphic-flux-chat)

##Tests

Run tests with karma via `npm test`

##Inspirations

Inspired/adapted from

  * [gaearon/redux](https://github.com/gaearon/redux)

  * [yahoo/fluxible-addons-react](https://github.com/yahoo/fluxible-addons-react)

Thanks to those for the help.
