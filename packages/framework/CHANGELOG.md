<a name="0.3.1"></a>
## [0.3.1](https://github.com/oribella/framework/compare/v0.3.0...v0.3.1) (2015-12-10)


### Bug Fixes

* **dist:** update dist to correct format ([8f58bdb](https://github.com/oribella/framework/commit/8f58bdb))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/oribella/framework/compare/v0.2.0...v0.3.0) (2015-12-10)


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
# [0.2.0](https://github.com/oribella/framework/compare/0.1.0...v0.2.0) (2015-08-14)


### Bug Fixes

* make sure to reset pointerIds, pagePoints for a touch flow that doesn't end corr ([87add65](https://github.com/oribella/framework/commit/87add65))
* **oribella:** export Point ([c9f7de4](https://github.com/oribella/framework/commit/c9f7de4))
* **registry:** initialize options on the correct subscriber instance ([7ed6e6e](https://github.com/oribella/framework/commit/7ed6e6e))
* **registry:** make sure to initialize subscriber options with a new reference ([3995d41](https://github.com/oribella/framework/commit/3995d41))

### Features

* **oribella:** Don't assume environment. Let the consumer send in element and environemnt confi ([efe66e2](https://github.com/oribella/framework/commit/efe66e2))



<a name="0.1.0"></a>
# 0.1.0 (2015-07-10)




