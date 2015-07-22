#NuclearJS addons for React

Addons to quickly help you start up with [React](https://github.com/facebook/react) using [NuclearJS](https://github.com/optimizely/nuclear-js)

## Install

`npm install nuclear-js-react-addons`

```javascript
var NuclearAddons = require('nuclear-js-react-addons')

// choose :o
var provideReactor = NuclearAddons.provideReactor;
var nuclearComponent = NuclearAddons.nuclearComponent;
var nuclearMixin = NuclearAddons.nuclearMixin;
```
or
```javascript
// choose :o
import {
    provideReactor,
    nuclearMixin,
    nuclearComponent
} from 'nuclear-js-react-addons';
```

### provideReactor

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
var provideReactor = require('nuclear-js-react-addons').provideReactor;
// or
var provideReactor = require('nuclear-js-react-addons/provideReactor');
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

Now the reactor is provided as the reactor key of the react context if you declare
```javascript
contextTypes: {
    reactor: React.propTypes.object.isRequired
}
```

which you won't have to do manually, because both a mixin and a component are available for you to use.

### nuclearMixin

```javascript
var nuclearMixin = require('nuclear-js-react-addons').nuclearMixin;
// or
var nuclearMixin = require('nuclear-js-react-addons/nuclearMixin');
var someNuclearModule = require('./someModule');
var someOtherNucModule = require('./someModule2');

// This component is used in a tree that somehow
// already has a reactor in its context
// maybe through using provideReactor or something else
var Child = React.createClass({
    mixins: [nuclearMixin],

    // you can omit this to simply have access to the reactor in the context
    getDataBindings: function() {
        return {
            foo: someNuclearModule.getters.meh,
            bar: someOtherNucModule.getters.whatever
        };
    },

    render: function() {
        // you can pass it to actions
        var reactor = this.context.reactor;
        // there is your data
        var foo = this.state.foo;
        var bar = this.state.bar;

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

### nuclearComponent
If you prefer to stay away from mixin, there's also a nuclear component to suit your needs. It also support the decorator pattern

Example using the decorator pattern:
```javascript
import { getters } from './someModule';
import { nuclearComponent } from 'nuclear-js-react-addons';

@nuclearComponent({
    foo: getters.meh,
    bar: getters.haha
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
var nuclearComponent = require('nuclear-js-react-addons').nuclearComponent;

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

nuclearModule.exports = nuclearComponent(Child, {
    foo: nuclearModule.getters.meh,
    bar: nuclearModule.getters.haha
});
```

##Examples

Additional [examples here](https://github.com/optimizely/nuclear-js/tree/master/examples/isomorphic-flux-chat)

##Tests

Browser tests spin up `npm run browser-tests` it will launch a webpack dev server and open http://localhost:8080/tests.runner.html, change the port with `npm run browsers-tests -- --port=#PORT`.

Node tests needs io.js (because of jsdom@5), run `npm tests` or `npm run watch` for TDD.

##Inspirations

Inspired/adapted from


  * [gaearon/redux](https://github.com/gaearon/redux)

  * [yahoo/fluxible-addons-react](https://github.com/gaearon/redux)

Thanks to those for the help.
