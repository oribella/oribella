---
id: tap
title: Tap
---

### Tap

```js
import { oribella, Tap } from 'oribella';

oribella.on(Tap, document, {
  options: {
    pointers: 1, //Default 1 e.g one finger
    radiusThreshold: 2, //Default is 2px e.g your finger may move 2px without cancelling the tap
    which: undefined, //Default undefined only applicable for mouse
    //which: [], //Allowed mouse buttons 0 - left button, 1 - wheel/middle button, 2 - right button
  },
  // called on touchstart, mousedown, pointerdown or MSPointerDown
  start: () => console.log('tap start!'),
  // called if it's a valid tap
  end: () => console.log('tap!'),
  // called if the ongoing tap was cancelled e.g touchcancel, dragstart or if other gesture takes control
  cancel: () => console.log('tap cancel!'),
  // always called after end no matter what
  stop: () => console.log('tap stop!'),
});
```
