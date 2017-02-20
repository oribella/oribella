# oribella-framework

[![CircleCI](https://circleci.com/gh/oribella/framework.svg?style=shield)](https://circleci.com/gh/oribella/framework) [![Coverage Status](https://coveralls.io/repos/github/oribella/framework/badge.svg)](https://coveralls.io/github/oribella/framework)

Have you felt frustrated over DOM events? Have you realised after getting some interaction working in Chrome that it doesn't work on IE on a hybrid device? Do you want to focus on features and be sure it works on all your supported browsers and devices?

Well, this is the core library of ***Oribella*** cross browser, cross device, cross input gesture framework.

***Oribella*** has a set of normalised gestures *Tap*, *Doubletap*, *Longtap*, *Swipe*, *LongtapSwipe*, *Pinch* and *Rotate*

Just because the gesture is named *Tap* it doesn't mean that it only works on *touch*. They are normalised and works cross input meaning it could be for example  *mouse*, *touch*, *pen*.

It's soul purpose is to normalize the event hell into an easy to understand flow. It currently understands mouse, touch, MSPointer and pointer event flows. However this is pluggable so if there comes another one it should "just" be able to plug it in. As long as it follows the following conventions.

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

So now we have covered the event flow which is the foundation for understanding how to build gestures.

To use the ***Oribella*** framework you need to instantiate the `Oribella` class and configure it. For convenience this is done for you by [Default gestures](https://github.com/oribella/default-gestures) repository.
