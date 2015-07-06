import {customAttribute, bindable, inject} from "aurelia-framework";

export class Gesture {
  constructor(element, oribella, type) {
    this.element = element;
    this.oribella = oribella;
    this.type = type;
  }
  bind() {
    this.remove = this.oribella.on(this.element, this.type, {
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
@inject(Element, "oribella")
export class Tap extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element, oribella) {
    super(element, oribella, "tap");
  }
}

@customAttribute("doubletap")
@inject(Element, "oribella")
export class Doubletap extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element, oribella) {
    super(element, oribella, "doubletap");
  }
}

@customAttribute("longtap")
@inject(Element, "oribella")
export class Longtap extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  @bindable timeEnd = function() {};
  constructor(element, oribella) {
    super(element, oribella, "longtap");
  }
}

@customAttribute("swipe")
@inject(Element, "oribella")
export class Swipe extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element, oribella) {
    super(element, oribella, "swipe");
  }
}

@customAttribute("longtap-swipe")
@inject(Element, "oribella")
export class LongtapSwipe extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element, oribella) {
    super(element, oribella, "longtapswipe");
  }
}

@customAttribute("pinch")
@inject(Element, "oribella")
export class Pinch extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element, oribella) {
    super(element, oribella, "pinch");
  }
}

@customAttribute("rotate")
@inject(Element, "oribella")
export class Rotate extends Gesture {
  @bindable selector = undefined;
  @bindable options = {};
  @bindable start = function() {};
  @bindable update = function() {};
  @bindable end = function() {};
  @bindable cancel = function() {};
  constructor(element, oribella) {
    super(element, oribella, "rotate");
  }
}
