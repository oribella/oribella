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

### Development

After cloning the mono repo

### Installation

Install root dependencies. (Most of the tooling)
```sh
npm i
```

### Bootstrap

Bootstrap will call `lerna boostrap --hoist`

```sh
npm run bootstrap
```

### Lint

```sh
npm run lint
```

### Test

Tests are running in Node with JSDOM

```sh
npm test
```

### Debugging

For easy debugging using [vscode](https://code.visualstudio.com/download)

Add a breakpoint in a `spec.ts` and hit F5 and off you go...

### Build

To generate umd and es format:

```sh
npm run build
```
