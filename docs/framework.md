---
id: framework
title: Framework
---
## Installation

NPM
```javascript
npm i oribella-framework
```
### Usage

```javascript
import { OribellaApi } from 'oribella-framework';

export const oribella = new OribellaApi();
oribella.registerDefaultFlowStrategy();
oribella.activate();
oribella.registerGesture(CustomGestureClass, CustomGestureOptions);
```
