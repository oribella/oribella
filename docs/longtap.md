---
id: longtap
title: Longtap
---

### Longtap

```js
import { oribella, Longtap } from 'oribella';

oribella.on(Longtap, document, {
  options: {
    radiusThreshold: 2, //Default is 2px e.g your finger may move 2px without cancelling the tap
    timeThreshold: 500, //Default is 500ms e.g you have to hold down your finger 500ms
  },
  // called on touchstart, mousedown, pointerdown or MSPointerDown
  start: () => console.log('Longtap start!'),
  // called when the time threshold of the longtap is met default 500ms
  end: () => console.log('Longtap!'),
  // called if the ongoing tap was cancelled e.g touchcancel, dragstart or if other gesture takes control
  cancel: () => console.log('Longtap cancel!'),
  // always called after end no matter what
  stop: () => console.log('Longtap stop!'),
});
```
