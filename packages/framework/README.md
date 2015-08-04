#oribella-framework

This is the core library of ***Oribella*** cross browser, cross device gesture framework. It's soul purpose is to normalize the event hell into an easy to understand flow. It currently understands mouse, touch, MSPointer and pointer event flows. However this is pluggable so if there comes another one it should "just" be able to plug it in. As long as it follows the following conventions.

1. ***Start*** event
2. ***Update*** event
3. ***End*** event
4. ***Cancel*** event

This ensures a solid flow where you always make sure to be in a good state. So for the current supported flows it could be translated into this:

### Mouse
##### start - mousedown
##### update - mousemove
##### end - mouseup
##### cancel - dragstart
What? Why dragstart? Since the browser stops sending mouse events as soon as it
becomes a drag we can't ensure a consistent flow hence we cancel the mouse flow.

### Touch
##### start - touchstart
##### update - touchmove
##### end - touchend, mouseup
##### cancel - touchcancel, dragstart
What? Why mouseup? Since there are browser quirks there are some use cases where you don't get a touchend but instead a mouseup.

### MSPointer
##### start - MSPointerDown
##### update - MSPointerMove
##### end - MSPointerUp
##### cancel - MSPointerCancel, dragstart

### pointer
##### start - pointerdown
##### update - pointermove
##### end - pointerup
##### cancel - pointercancel, dragstart

So now we have covered the event flow which is the foundation for understanding how to build gestures. However there are a couple of more conventions in the flow engine. One is validation. The validation mechanism is called on **start**, **update**, **end** and cancel gestures that isn't valid anymore. It evalutates the `options.touches` property in an additive way. This means that in `start` it checks that you don't have more touch points (for mouse this is always 1) and triggers `start`. In `update` it will not trigger `update` if you don't have equal touch points. As soon as you have equal touch points it starts triggering `update`. In `end` it needs to be equal to the configured touch points.

*Oribella* has already a set of gestures which is [Tap](https://github.com/oribella/tap), [Doubletap](https://github.com/oribella/doubletap), [Longtap](https://github.com/oribella/longtap), [Swipe](https://github.com/oribella/swipe), [LongtapSwipe](https://github.com/oribella/longtap-swipe), [Pinch](https://github.com/oribella/pinch) and [Rotate](https://github.com/oribella/rotate).

To use the *Oribella* framework you need to instantiate the `Oribella` class and configure it. For convenience this is done for you by [Default gestures](https://github.com/oribella/default-gestures) repository.
