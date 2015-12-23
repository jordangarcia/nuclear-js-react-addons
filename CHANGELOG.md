## 0.3.0 (December 23, 2015)

New API very much inspired from [react-redux](https://github.com/rackt/react-redux).  

  - new `Provider` component
  - new function `conenct()` using a Higher Order Component to setup a data binding of getters child component passed via props.
  - [DEPRECATED] `provideReactor` (can still be used with deprecation warning)
  - [DEPRECATED] `nuclearComponent` (can still be used with deprecation warning)


## 0.2.0 (September 14, 2015)

 - BREAKING CHANGE: nuclearComponent API matches nuclearMixin API for getDataBindings

 now the nuclearComponent will always take a function that receives props (to avoid `this` bindings ambiguity and to match the constructor signature if using es6)

## 0.1.1 (August 10, 2015)

 - Fix documentation
 - Improve README.md
 - UMD build


## 0.1.0 (July 22, 2015)

 - Initial release
