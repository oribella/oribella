---
id: pinch
title: Pinch
---

### Pinch

```js
import { oribella, Pinch } from 'oribella';

oribella.on(Pinch, document, {
  options: {
    pinchThreshold: 10, //Default 10px e.g you have to pinch your fingers more than 10px
  },
  // called on touchstart, mousedown, pointerdown or MSPointerDown
  down: () => console.log('pinch down!'),
  // called when the radius threshold of the pinch is met default 10px
  start: () => console.log('pinch start!'),
  // called as long it's a valid pinch on touchmove, mousemove, pointermove, MSPointerMove
  update: () => console.log('pinching!'),
  // called if it was a valid pinch
  end: () => console.log('pinch!'),
  // called if the ongoing pinch was cancelled e.g touchcancel, dragstart or if other gesture takes control
  cancel: () => console.log('pinch cancel!'),
  // always called after end no matter what
  stop: () => console.log('pinch stop!'),
});
```
