import {customAttribute, bindable, inject} from 'aurelia-framework';
import {oribella} from "oribella";


class Gesture {
  constructor(element, type) {
    this.element = element;
    this.type = type;
  }
  bind() {
    this.remove = oribella(this.element)[this.type]({
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
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class Tap extends Gesture {
  constructor(element) {
    super(element, "tap");
  }
}

@customAttribute("doubletap")
@inject(Element)
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class Doubletap extends Gesture {
  constructor(element) {
    super(element, "doubletap");
  }
}

@customAttribute("longtap")
@inject(Element)
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
@bindable("timeEnd")
class Longtap extends Gesture {
  constructor(element) {
    super(element, "longtap");
  }
}

@customAttribute("swipe")
@inject(Element)
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class Swipe extends Gesture {
  constructor(element) {
    super(element, "swipe");
  }
}
 
@customAttribute("longtap-swipe")
@inject(Element)
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class LongtapSwipe extends Gesture {
  constructor(element) {
    super(element, "longtapswipe");
  }
}

@customAttribute("pinch")
@inject(Element)
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class Pinch extends Gesture {
  constructor(element) {
    super(element, "pinch");
  }
}

@customAttribute("rotate")
@inject(Element)
@bindable("selector")
@bindable("options")
@bindable("start")
@bindable("update")
@bindable("end")
@bindable("cancel")
class Rotate extends Gesture {
  constructor(element) {
    super(element, "rotate");
  }
}
