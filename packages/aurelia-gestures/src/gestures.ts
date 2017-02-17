import { DOM } from 'aurelia-pal';
import { customAttribute, bindable } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { oribella, Tap, Doubletap, Longtap, Swipe, LongtapSwipe, Pinch, Rotate } from 'oribella';

@customAttribute('oa-tap')
@inject(DOM.Element)
export class OaTap {
  @bindable public selector: string;
  @bindable public options = {};
  @bindable public start = () => { };
  @bindable({ primaryProperty: true }) public end = () => { };
  @bindable public cancel = () => { };
  @bindable public stop = () => { };
  private remove: () => void = () => { };
  constructor(public element: Element) { }

  public attached() {
    this.remove = oribella.on(Tap, this.element, this as any);
  }
  public detached() {
    this.remove();
  }
}

@customAttribute('oa-doubletap')
@inject(DOM.Element)
export class OaDoubletap {
  @bindable public selector: string;
  @bindable public options: {};
  @bindable({ primaryProperty: true }) public end = () => { };
  private remove: () => void = () => { };
  constructor(public element: Element) { }

  public attached() {
    this.remove = oribella.on(Doubletap, this.element, this as any);
  }
  public detached() {
    this.remove();
  }
}

@customAttribute('oa-longtap')
@inject(DOM.Element)
export class OaLongtap {
  @bindable public selector: string;
  @bindable public options = {};
  @bindable public start = () => { };
  @bindable public end = () => { };
  @bindable public cancel = () => { };
  @bindable public stop = () => { };
  @bindable({ primaryProperty: true }) public timeEnd = () => { };
  private remove: () => void = () => { };
  constructor(public element: Element) { }

  public attached() {
    this.remove = oribella.on(Longtap, this.element, this as any);
  }
  public detached() {
    this.remove();
  }
}

@customAttribute('oa-swipe')
@inject(DOM.Element)
export class OaSwipe {
  @bindable public selector: string;
  @bindable public options = {};
  @bindable public down = () => { };
  @bindable public start = () => { };
  @bindable({ primaryProperty: true }) public update = () => { };
  @bindable public end = () => { };
  @bindable public cancel = () => { };
  @bindable public stop = () => { };
  private remove: () => void = () => { };
  constructor(public element: Element) { }

  public attached() {
    this.remove = oribella.on(Swipe, this.element, this as any);
  }
  public detached() {
    this.remove();
  }
}

@customAttribute('oa-longtap-swipe')
@inject(DOM.Element)
export class OaLongtapSwipe {
  @bindable public selector: string;
  @bindable public options = {};
  @bindable public down = () => { };
  @bindable public start = () => { };
  @bindable({ primaryProperty: true }) public update = () => { };
  @bindable public end = () => { };
  @bindable public cancel = () => { };
  @bindable public stop = () => { };
  private remove: () => void = () => { };
  constructor(public element: Element) { }

  public attached() {
    this.remove = oribella.on(LongtapSwipe, this.element, this as any);
  }
  public detached() {
    this.remove();
  }
}

@customAttribute('oa-pinch')
@inject(DOM.Element)
export class OaPinch {
  @bindable public selector: string;
  @bindable public options = {};
  @bindable public down = () => { };
  @bindable public start = () => { };
  @bindable({ primaryProperty: true }) public update = () => { };
  @bindable public end = () => { };
  @bindable public cancel = () => { };
  @bindable public stop = () => { };
  private remove: () => void = () => { };
  constructor(public element: Element) { }

  public attached() {
    this.remove = oribella.on(Pinch, this.element, this as any);
  }
  public detached() {
    this.remove();
  }
}

@customAttribute('oa-rotate')
@inject(DOM.Element)
export class OaRotate {
  @bindable public selector: string;
  @bindable public options = {};
  @bindable public down = () => { };
  @bindable public start = () => { };
  @bindable({ primaryProperty: true }) public update = () => { };
  @bindable public end = () => { };
  @bindable public cancel = () => { };
  @bindable public stop = () => { };
  private remove: () => void = () => { };
  constructor(public element: Element) { }

  public attached() {
    this.remove = oribella.on(Rotate, this.element, this as any);
  }
  public detached() {
    this.remove();
  }
}
