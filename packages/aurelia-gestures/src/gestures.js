import {customAttribute, bindable, inject, transient} from "aurelia-framework";
import {oribella} from "oribella-default-gestures";

class Gesture {
  constructor(element, type) {
    this.element = element;
    this.type = type;
  }
  attached() {
    this.remove = oribella.on(this.element, this.type, {
      selector: this.selector,
      options: this.options,
      start: (event, data, element) => this.start({ event: event, data: data, element: element }),
      update: (event, data, element) => this.update({ event: event, data: data, element: element }),
      end: (event, data, element) => this.end({ event: event, data: data, element: element }),
      cancel: (event, data, element) => this.cancel({ event: event, data: data, element: element }),
      timeEnd: (event, data, element) => this.timeEnd({ event: event, data: data, element: element })
    });
  }
  detached() {
    this.remove();
  }
}

@customAttribute("tap")
@inject(Element)
@transient()
export class Tap extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element) {
    super(element, "tap");
  }
}

@customAttribute("doubletap")
@inject(Element)
@transient()
export class Doubletap extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element) {
    super(element, "doubletap");
  }
}

@customAttribute("longtap")
@inject(Element)
@transient()
export class Longtap extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  @bindable timeEnd = function() {};
  constructor(element) {
    super(element, "longtap");
  }
}

@customAttribute("swipe")
@inject(Element)
@transient()
export class Swipe extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element) {
    super(element, "swipe");
  }
}

@customAttribute("longtap-swipe")
@inject(Element)
@transient()
export class LongtapSwipe extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element) {
    super(element, "longtapswipe");
  }
}

@customAttribute("pinch")
@inject(Element)
@transient()
export class Pinch extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element) {
    super(element, "pinch");
  }
}

@customAttribute("rotate")
@inject(Element)
@transient()
export class Rotate extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element) {
    super(element, "rotate");
  }
}
