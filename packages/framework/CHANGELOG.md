<a name="0.5.0"></a>
# 0.5.0 (2016-03-25)




<a name="0.4.4"></a>
## [0.4.4](https://github.com/oribella/framework/compare/1aaca55...v0.4.4) (2016-03-15)


### Bug Fixes

* **engine:** make sure to process gestures cancel callback ([1aaca55](https://github.com/oribella/framework/commit/1aaca55))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/oribella/framework/compare/831b321...v0.4.3) (2016-03-07)


### Bug Fixes

* **flow:** pass correct parameters to `cancelCallback` ([831b321](https://github.com/oribella/framework/commit/831b321))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/oribella/framework/compare/de679a9...v0.4.2) (2016-03-04)


### Bug Fixes

* **dist:** update dist ([de679a9](https://github.com/oribella/framework/commit/de679a9))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/oribella/framework/compare/8a8b118...v0.4.1) (2016-03-03)


### Bug Fixes

* **registry:** remove `Object.getOwnPropertyDescriptors` and use internal `getOwnPropertyDescri ([8a8b118](https://github.com/oribella/framework/commit/8a8b118))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/oribella/framework/compare/cf67415...v0.4.0) (2016-02-22)


### Features

* **pointers:** expose pointer object with `page` and `client` properties containing points ([cf67415](https://github.com/oribella/framework/commit/cf67415))


### BREAKING CHANGES

* pointers: 



<a name="0.3.5"></a>
## [0.3.5](https://github.com/oribella/framework/compare/f607af6...v0.3.5) (2015-12-13)


### Bug Fixes

* **dist:** update ([f607af6](https://github.com/oribella/framework/commit/f607af6))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/oribella/framework/compare/5681d02...v0.3.4) (2015-12-11)


### Bug Fixes

* **dist:** use `es2015`, `stage-1` and `stage-2` ([5681d02](https://github.com/oribella/framework/commit/5681d02))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/oribella/framework/compare/4421df5...v0.3.3) (2015-12-11)


### Bug Fixes

* **dist:** update dist ([4421df5](https://github.com/oribella/framework/commit/4421df5))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/oribella/framework/compare/3486319...v0.3.2) (2015-12-11)


### Bug Fixes

* **dist:** update dist ([3486319](https://github.com/oribella/framework/commit/3486319))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/oribella/framework/compare/8f58bdb...v0.3.1) (2015-12-10)


### Bug Fixes

* **dist:** update dist to correct format ([8f58bdb](https://github.com/oribella/framework/commit/8f58bdb))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/oribella/framework/compare/48e21e5...v0.3.0) (2015-12-10)


### Bug Fixes

* Handle the multiple pointers scenario in a better way ([a218b8a](https://github.com/oribella/framework/commit/a218b8a))
* remove the possible mutated data object ([48e21e5](https://github.com/oribella/framework/commit/48e21e5))
* **engine:** fix for matching without selector ([cd308fe](https://github.com/oribella/framework/commit/cd308fe))
* **touch:** remove Array.from since it need a polyfill ([d7c79f0](https://github.com/oribella/framework/commit/d7c79f0))

### Features

* Enable multiple gestures running side by side ([1af74dd](https://github.com/oribella/framework/commit/1af74dd))


### BREAKING CHANGES

* The behavior for canceling a gesture has changed and the
`options.strategy` must be set to `STRATEGY_FLAG.REMOVE_IF_POINTERS_GT` to keep
the old behavior.
* A data object was passed around to gestures and subscribers
which was shared for all gestures. It's now up to every gesture to define a data
object that is sent out to the subscribers.



<a name="0.2.0"></a>
# [0.2.0](https://github.com/oribella/framework/compare/efe66e2...v0.2.0) (2015-08-14)


### Bug Fixes

* make sure to reset pointerIds, pagePoints for a touch flow that doesn't end corr ([87add65](https://github.com/oribella/framework/commit/87add65))
* **oribella:** export Point ([c9f7de4](https://github.com/oribella/framework/commit/c9f7de4))
* **registry:** initialize options on the correct subscriber instance ([7ed6e6e](https://github.com/oribella/framework/commit/7ed6e6e))
* **registry:** make sure to initialize subscriber options with a new reference ([3995d41](https://github.com/oribella/framework/commit/3995d41))

### Features

* **oribella:** Don't assume environment. Let the consumer send in element and environemnt confi ([efe66e2](https://github.com/oribella/framework/commit/efe66e2))



<a name="0.1.0"></a>
# 0.1.0 (2015-07-10)




