---
id: rotate
title: Rotate
---

### Rotate

```js
import { oribella, Rotate } from 'oribella';

oribella.on(Rotate, document, {
  options: {
    rotationThreshold: 10, //Default 10px e.g you have to rotate your fingers more than 10px
  },
  // called on touchstart, mousedown, pointerdown or MSPointerDown
  down: () => console.log('rotate down!'),
  // called when the radius threshold of the rotate is met default 10px
  start: () => console.log('rotate start!'),
  // called as long it's a valid rotate on touchmove, mousemove, pointermove, MSPointerMove
  update: () => console.log('rotating!'),
  // called if it was a valid rotate
  end: () => console.log('rotate!'),
  // called if the ongoing rotate was cancelled e.g touchcancel, dragstart or if other gesture takes control
  cancel: () => console.log('rotate cancel!'),
  // always called after end no matter what
  stop: () => console.log('rotate stop!'),
});
```
