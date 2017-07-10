import { PointerData, Pointers } from './utils';

export class EventEmitter {
  // tslint:disable-next-line:ban-types
  private listenerMap: Map<string, Function[]> = new Map();

  // tslint:disable-next-line:ban-types
  public on(event: string, listener: Function): this {
    const listeners = this.listenerMap.get(event) || [];
    listeners.push(listener);
    this.listenerMap.set(event, listeners);
    return this;
  }
  public emit(event: string, ...args: any[]): boolean {
    const listeners = this.listenerMap.get(event) || [];
    listeners.forEach((listener) => listener.apply(null, args));
    return true;
  }
}

export class EventConfig {
  private events: string[];
  constructor(...events: string[]) { this.events = events; }
  public getEvents() {
    return this.events;
  }
}

export interface FlowConfig {
  start: EventConfig;
  update: EventConfig;
  end: EventConfig;
  cancel: EventConfig;
}

export class Flow extends EventEmitter {
  public config: FlowConfig;
  public startListen: Array<() => () => void> = [];
  public continueListen: Array<() => () => void> = [];
  public removeListeners: Array<() => void> = [];
  public allPointers: Map<number, PointerData> = new Map<number, PointerData>();
  public changedPointers: Map<number, PointerData> = new Map<number, PointerData>();
  public pointers: Pointers = { all: this.allPointers, changed: this.changedPointers };

  constructor(private element: Element | Document, config: FlowConfig) {
    super();
    this.config = config;
  }

  public addDOMEventListener(element: Element, evt: string, fn: (evt: Event) => void): () => void {
    const proxy = this.proxy.bind(this, fn);
    element.addEventListener(evt, proxy, false);
    return this.removeDOMEventListener.bind(this, element, evt, proxy);
  }

  public removeDOMEventListener(element: Element, evt: string, fn: () => void) {
    element.removeEventListener(evt, fn, false);
  }

  public bind(config: FlowConfig): { startListen: Array<() => () => void>, continueListen: Array<() => () => void> } {
    this.startListen = config.start.getEvents().map((e) => {
      return this.addDOMEventListener.bind(this, this.element, e, this.start.bind(this));
    });
    this.continueListen = config.update.getEvents().map((e) => {
      return this.addDOMEventListener.bind(this, this.element, e, this.update.bind(this));
    });
    this.continueListen.push.apply(
      this.continueListen,
      config.end.getEvents().map((e) => {
        return this.addDOMEventListener.bind(this, this.element, e, this.end.bind(this));
      })
    );
    this.continueListen.push.apply(
      this.continueListen,
      config.cancel.getEvents().map((e) => {
        return this.addDOMEventListener.bind(this, this.element, e, this.cancel.bind(this));
      })
    );
    return { startListen: this.startListen, continueListen: this.continueListen };
  }
  public activate(): Array<() => void> {
    return this.bind(this.config).startListen.map((f) => f());
  }
  public setPointers(_EVT: Event) {
  }
  public start(evt: Event) {
    this.emit('start', evt, this.pointers);
  }
  public update(evt: Event) {
    this.emit('update', evt, this.pointers);
  }
  public end(evt: Event) {
    this.emit('end', evt, this.pointers);
    if (this.allPointers.size === 0) {
      this.stop();
    }
  }
  public cancel(evt: Event) {
    this.emit('cancel', evt, this.pointers);
    this.stop();
  }
  public continue() {
    this.removeListeners = this.continueListen.map((f) => f());
  }
  public stop() {
    this.removeListeners.forEach((remove) => remove());
    this.removeListeners = [];
    this.emit('stop');
  }
  private proxy(fn: (evt: Event) => void, evt: Event) {
    this.setPointers(evt);
    fn(evt);
  }

}
