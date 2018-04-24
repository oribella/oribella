![oribella](./website/static/img/oa.svg)

A cross platform, cross browser, cross input gesture building platform with preconfigured gestures such as tap, longtap, doubletap, swipe, longtap-swipe, pinch and rotate.

## Getting started

### Installation

```sh
npm i oribella
```

### Usage

```js
import { oribella, Tap, Swipe } from 'oribella';

oribella.on(Tap, document, { end: () => console.log('tap!') });
oribella.on(Swipe, document, { update: () => console.log('swiping!') });
```

Go to the [website](https://oribella.github.io/oribella/) for more information.
