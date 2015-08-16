import {customAttribute, bindable, inject} from "aurelia-framework";
import {oribella} from "oribella-default-gestures";

class Gesture {
  constructor(element, type) {
    this.element = element;
    this.type = type;
  }
  bind() {
    this.remove = oribella.on(this.element, this.type, {
      selector: this.selector,
      options: this.options,
      start: this.start,
      update: this.update,
      end: this.end,
      cancel: this.cancel,
      timeEnd: this.timeEnd
    });
  }
  unbind() {
    this.remove();
  }
}

@customAttribute("tap")
@inject(Element)
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
