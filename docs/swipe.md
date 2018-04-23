---
id: swipe
title: Swipe
---

### Swipe

```js
import { oribella, Swipe } from 'oribella';

oribella.on(Swipe, document, {
  options: {
    pointers: 1, //Default 1 e.g one finger
    radiusThreshold: 2, //Default 2px e.g you have to move your finger more than 2px
  },
  // called on touchstart, mousedown, pointerdown or MSPointerDown
  down: () => console.log('swipe down!'),
  // called when the radius threshold of the swipe is met default 2px
  start: () => console.log('swipe start!'),
  // called as long it's a valid swipe on touchmove, mousemove, pointermove, MSPointerMove
  update: () => console.log('swiping!'),
  // called if it was a valid swipe
  end: () => console.log('swipe!'),
  // called if the ongoing swipe was cancelled e.g touchcancel, dragstart or if other gesture takes control
  cancel: () => console.log('swipe cancel!'),
  // always called after end no matter what
  stop: () => console.log('swipe stop!'),
});
```
