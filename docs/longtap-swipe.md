---
id: longtap-swipe
title: Longtap swipe
---

### Longtap swipe

```js
import { oribella, LongtapSwipe } from 'oribella';

oribella.on(LongtapSwipe, document, {
  // called on touchstart, mousedown, pointerdown or MSPointerDown
  down: () => console.log('longtap-swipe down!'),
  // called when the time threshold of the longtap is met default 500ms
  start: () => console.log('longtap-swipe start!'),
  // called as long it's a valid swipe on touchmove, mousemove, pointermove, MSPointerMove
  update: () => console.log('longtap-swiping!'),
  // called if it was a valid longtap-swipe
  end: () => console.log('longtap-swipe!'),
  // called if the ongoing longtap-swipe was cancelled e.g touchcancel, dragstart or if other gesture takes control
  cancel: () => console.log('longtap-swipe cancel!'),
  // always called after end no matter what
  stop: () => console.log('longtap-swipe stop!');
});
```
