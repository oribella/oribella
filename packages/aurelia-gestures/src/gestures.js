import {customAttribute, bindable, inject} from "aurelia-framework";

class Gesture {
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
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class Tap extends Gesture {
  constructor(element, oribella) {
    super(element, oribella, "tap");
  }
}

@customAttribute("doubletap")
@inject(Element, "oribella")
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class Doubletap extends Gesture {
  constructor(element, oribella) {
    super(element, oribella, "doubletap");
  }
}

@customAttribute("longtap")
@inject(Element, "oribella")
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
@bindable("timeEnd")
class Longtap extends Gesture {
  constructor(element, oribella) {
    super(element, oribella, "longtap");
  }
}

@customAttribute("swipe")
@inject(Element, "oribella")
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class Swipe extends Gesture {
  constructor(element, oribella) {
    super(element, oribella, "swipe");
  }
}

@customAttribute("longtap-swipe")
@inject(Element, "oribella")
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class LongtapSwipe extends Gesture {
  constructor(element, oribella) {
    super(element, oribella, "longtapswipe");
  }
}

@customAttribute("pinch")
@inject(Element, "oribella")
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class Pinch extends Gesture {
  constructor(element, oribella) {
    super(element, oribella, "pinch");
  }
}

@customAttribute("rotate")
@inject(Element, "oribella")
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class Rotate extends Gesture {
  constructor(element, oribella) {
    super(element, oribella, "rotate");
  }
}
