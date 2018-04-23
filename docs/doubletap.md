---
id: doubletap
title: Doubletap
---

### Doubletap

```js
import { oribella, Doubletap } from 'oribella';

oribella.on(Doubletap, document, {
  options: {
    timeThreshold: 250, //Default is 250ms e.g you have to finish 2 taps within 250ms
  },
  // called if it's a valid Doubletap
  end: () => console.log('Doubletap!'),
});
```
