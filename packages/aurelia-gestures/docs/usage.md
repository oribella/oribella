## Installation

JSPM

```javascript
jspm install npm:oribella-aurelia-gestures
```
NPM
```javascript
npm install oribella-aurelia-gestures
```

## Load the plugin

```javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin("oribella-aurelia-gestures");

  aurelia.start().then(a => a.setRoot());
}
```

## Use the plugin

## Tap
### Primary - `end`
```html
<div oa-tap.call="onTap()"></div>
```
### Advanced
```html
<div oa-tap="
  start.call: onStart();
  end.call: onEnd();
  cancel.call: onCancel();
  stop.call: onStop()"></div>
```
## Doubletap
```html
<div oa-doubletap.call="onDoubletap()"></div>
```

## Longtap
### Primary - `timeEnd`
```
<div oa-longtap.call="onLongtap()"></div>
```
### Advanced
```html
<div oa-longtap="
  start.call: onStart();
  update.call: onUpdate();
  end.call: onEnd();
  cancel.call: onCancel();
  stop.call: onStop()"></div>
```

## Swipe
### Primary - `update`
```html
<div oa-swipe.call="onSwipe()"></div>
```
### Advanced
```html
<div oa-swipe="
  down.call: onDown();
  start.call: onStart();
  update.call: onUpdate();
  end.call: onEnd();
  cancel.call: onCancel();
  stop.call: onStop()"></div>
```

## LongtapSwipe
### Primary - `update`
```html
<div oa-longtap-swipe.call="onLongtapSwipe()"></div>
```
### Advanced
```html
<div oa-longtap-swipe="
  down.call: onDown();
  start.call: onStart();
  update.call: onUpdate();
  end.call: onEnd();
  cancel.call: onCancel();
  stop.call: onStop()"></div>
```

## Pinch
### Primary - `update`
```html
<div oa-pinch.call="onPinch()"></div>
```
### Advanced
```html
<div oa-pinch-swipe="
  down.call: onDown();
  start.call: onStart();
  update.call: onUpdate();
  end.call: onEnd();
  cancel.call: onCancel();
  stop.call: onStop()"></div>
```

## Rotate
### Primary - `update`
```html
<div oa-rotate.call="onRotate()"></div>
```
### Advanced
```html
<div oa-rotate="
  down.call: onDown();
  start.call: onStart();
  update.call: onUpdate();
  end.call: onEnd();
  cancel.call: onCancel();
  stop.call: onStop()"></div>
```
