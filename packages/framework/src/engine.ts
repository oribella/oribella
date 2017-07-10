import { Registry } from './registry';
import { Gesture, DefaultGesture } from './gesture';
import { Listener, DefaultListener } from './listener';
import { Flow } from './flow';
import { Options, Data, Pointers, PointerDataMap, PointerData, isMouse, isValidMouseButton, RETURN_FLAG, GESTURE_STRATEGY_FLAG, matchesSelector } from './utils';
import { ListenerHandle } from './listener-handle';

export interface PointersDelta {
  all: number;
  changed: number;
}
export interface ExecStrategyState {
  evt: Event;
  gestures: DefaultGesture[];
  gesture: DefaultGesture;
  pointers: Pointers;
  pointersDelta: PointersDelta;
}
export type ExecStrategy = (state: ExecStrategyState) => number;

export class Engine {
  private flows: Flow[] = [];
  private activeFlow: Flow | null = null;
  private handles: Array<ListenerHandle<& typeof Gesture>> = [];
  private gestures: DefaultGesture[] = [];
  private composedGestures: DefaultGesture[] = [];

  constructor(
    private element: Element | Document,
    private registry: Registry = new Registry(),
  ) { }

  public registerGesture<G extends typeof Gesture, O extends typeof Options, L extends typeof Listener, D extends typeof Data>(Gesture: G, GestureOptions: O = Options as O, GestureListener: L = Listener as L, GestureData: D = Data as D) {
    this.registry.register(Gesture, GestureOptions, GestureListener, GestureData);
  }
  public registerFlow(flow: Flow) {
    this.flows.push(flow);
    flow.on('start', (e: Event, p: Pointers) => this.onStart(flow, e, p));
    flow.on('update', (e: Event, p: Pointers) => this.onUpdate(flow, e, p));
    flow.on('end', (e: Event, p: Pointers) => this.onEnd(flow, e, p));
    flow.on('cancel', (e: Event, p: Pointers) => this.onCancel(flow, e, p));
    flow.on('stop', () => this.onStop());
  }
  public registerListener<T extends typeof Gesture>(Type: T, element: Element, listener: DefaultListener): () => void {
    const handle = new ListenerHandle(Type, element, listener);

    this.handles.push(handle);

    return () => {
      const ix = this.handles.indexOf(handle);
      if (ix !== -1) {
        this.handles.splice(ix, 1);
      }
    };
  }
  public activate() {
    return this.flows.map((f) => f.activate());
  }
  private canActivateFlow(flow: Flow) {
    return (this.activeFlow === null || this.activeFlow === flow);
  }
  private getPointersDelta(evt: Event, pointers: Pointers, configuredPointers: number, configuredWhich: number[] | number): PointersDelta {
    if (isMouse(evt) &&
      !isValidMouseButton(evt as MouseEvent, configuredWhich)) {
      return { all: -1, changed: -1 };
    }
    const all = pointers.all.size - configuredPointers;
    const changed = pointers.changed.size - configuredPointers;
    return { all, changed };
  }
  private removeGesture(gesture: DefaultGesture, ...arr: DefaultGesture[][]) {
    if (gesture.startEmitted) {
      gesture.cancel();
    }
    gesture.unbind();
    let gestures;
    while (gestures = arr.shift()) {
      const ix = gestures.indexOf(gesture);
      if (ix !== -1) {
        gestures.splice(ix, 1);
      }
    }
  }
  private evaluateStrategyReturnFlag(gesture: DefaultGesture, flag: number) {
    if (flag & RETURN_FLAG.START_EMITTED) {
      gesture.startEmitted = true;
    }
    if (flag & RETURN_FLAG.REMOVE) {
      this.removeGesture(gesture, this.gestures, this.composedGestures);
    }
    if (flag & RETURN_FLAG.REMOVE_OTHERS) {
      const others = this.gestures.slice();
      let otherGesture;
      while (otherGesture = others.shift()) {
        if (gesture === otherGesture) {
          continue;
        }
        this.removeGesture(otherGesture, this.gestures, this.composedGestures);
      }
    }
  }
  private whileGestures(evt: Event, gestures: DefaultGesture[], pointers: Pointers, execStrategy: ExecStrategy) {
    let gesture;
    while (gesture = gestures.shift()) {
      const { pointers: configuredPointers, which, strategy } = gesture.listener.options;
      const pointersDelta = this.getPointersDelta(evt, pointers, configuredPointers, which);
      if (pointersDelta.all > 0 && strategy === GESTURE_STRATEGY_FLAG.REMOVE_IF_POINTERS_GT) {
        this.removeGesture(gesture, this.gestures, this.composedGestures);
        continue;
      }
      const flag = execStrategy({ evt, gestures, gesture, pointers, pointersDelta });
      this.evaluateStrategyReturnFlag(gesture, flag);
    }
  }
  private addPointerId(gesture: DefaultGesture, pointerId: number) {
    gesture.__POINTERIDS__.push(pointerId);
  }
  private removePointerIds(map: PointerDataMap, gesture: DefaultGesture, changed: number[]) {
    const pointerIds = this.getPointerIds(gesture);
    let pointerId;
    while (pointerId = changed.shift()) {
      const ix = pointerIds.indexOf(pointerId);
      if (ix !== -1) {
        const removed = pointerIds.splice(ix, 1)[0];
        const pointer = this.getPointer(map, removed);
        gesture.__REMOVED_POINTERS__.push(pointer);
      }
    }
  }
  private getPointerIds(gesture: DefaultGesture) {
    return gesture.__POINTERIDS__;
  }
  private getRemovedPointers(gesture: DefaultGesture) {
    return gesture.__REMOVED_POINTERS__;
  }
  private getPointer(map: PointerDataMap, pointerId: number): PointerData {
    return map.get(pointerId) as PointerData;
  }
  private getPointers(map: PointerDataMap, pointerIds: number[]): PointerData[] {
    return pointerIds.map((pointerId) => this.getPointer(map, pointerId));
  }
  private isLockedPointers(gesture: DefaultGesture, map: PointerDataMap): boolean {
    const pointerIds = this.getPointerIds(gesture);
    return pointerIds.filter((pointerId) => map.has(pointerId)).length === map.size;
  }
  private startStrategy(state: ExecStrategyState): number {
    if (state.pointersDelta.all !== 0) {
      return RETURN_FLAG.IDLE;
    }
    // Lock pointer ids on gesture
    state.pointers.all.forEach((_, pointerId) => this.addPointerId(state.gesture, pointerId));
    state.gesture.args.data.pointers = this.getPointers(state.pointers.all, this.getPointerIds(state.gesture));
    state.gesture.args.evt = state.evt;
    return state.gesture.start(state.gesture.args);
  }
  private updateStrategy(state: ExecStrategyState): number {
    if (!this.isLockedPointers(state.gesture, state.pointers.all)) {
      return RETURN_FLAG.IDLE;
    }
    state.gesture.args.data.pointers = this.getPointers(state.pointers.all, this.getPointerIds(state.gesture));
    state.gesture.args.evt = state.evt;
    return state.gesture.update(state.gesture.args);
  }
  private endStrategy(state: ExecStrategyState): number {
    if (!state.gesture.startEmitted) {
      state.gesture.stop();
      return RETURN_FLAG.REMOVE;
    }
    this.removePointerIds(state.pointers.changed, state.gesture, Array.from(state.pointers.changed.keys()));
    if (this.getPointerIds(state.gesture).length !== 0) {
      return RETURN_FLAG.IDLE;
    }
    state.gesture.args.data.pointers = this.getRemovedPointers(state.gesture);
    state.gesture.args.evt = state.evt;
    return state.gesture.end(state.gesture.args);
  }
  private cancelStrategy(state: ExecStrategyState): number {
    return state.gesture.cancel();
  }
  private onStart(flow: Flow, evt: Event, pointers: Pointers): boolean {
    if (!this.canActivateFlow(flow)) {
      return false;
    }
    this.activeFlow = flow;
    this.activeFlow.continue();

    this.gestures = this.gestures
      .concat(this.match(evt.target as Node, evt))
      .sort((g1, g2) => {
        return g1.listener.options.prio -
          g2.listener.options.prio;
      });

    if (!this.gestures.length) {
      return false; // No match don't continue
    }

    this.whileGestures(evt, this.gestures.slice(), pointers, this.startStrategy.bind(this));

    return true;
  }
  private onUpdate(flow: Flow, evt: Event, pointers: Pointers) {
    if (this.activeFlow !== flow) {
      return;
    }
    this.whileGestures(evt, this.gestures.slice(), pointers, this.updateStrategy.bind(this));
  }
  private onEnd(flow: Flow, evt: Event, pointers: Pointers) {
    if (this.activeFlow !== flow) {
      return;
    }
    this.whileGestures(evt, this.gestures.slice(), pointers, this.endStrategy.bind(this));
  }
  private onCancel(flow: Flow, evt: Event, pointers: Pointers) {
    if (this.activeFlow !== flow) {
      return;
    }
    this.whileGestures(evt, this.gestures.slice(), pointers, this.cancelStrategy.bind(this));
  }
  private onStop() {
    const gestures = this.gestures.slice();
    let gesture;

    // Check for composing gestures for example Doubletap
    while (gesture = gestures.shift()) {
      if (RETURN_FLAG.COMPOSE === gesture.unbind()) {
        this.composedGestures.push(gesture);
      } else {
        gesture.stop();
      }
    }

    this.gestures.length = 0;
    this.activeFlow = null;
  }
  private addGesture<T extends typeof Gesture>(Type: T, element: Element, handle: ListenerHandle<T>, evt: Event): DefaultGesture {
    const gesture = this.registry.create<T>(Type, element, handle.listener);
    gesture.bind(handle.element, this.registerListener.bind(this), this.removeGesture.bind(this, gesture, this.gestures, this.composedGestures), evt);
    return gesture;
  }
  private composeGesture<T extends typeof Gesture>(Type: T, element: Element, handle: ListenerHandle<T>, evt: Event): DefaultGesture {
    let gesture;
    while (gesture = this.composedGestures.shift()) {
      if (gesture.listener === handle.listener) {
        break;
      }
    }
    if (!gesture) {
      gesture = this.addGesture(Type, element, handle, evt);
    }
    return gesture;
  }
  private matchesHandle<T extends typeof Gesture>(element: Element, handle: ListenerHandle<T>): boolean {
    const { element: refElement, listener: { selector } } = handle;

    if (!refElement.contains(element)) {
      return false;
    }
    if (selector && refElement === element) {
      return false;
    }
    if (selector && !matchesSelector(element, selector)) {
      return false;
    }
    if (!selector && element !== refElement) {
      return false;
    }
    return true;
  }
  private matchHandle<T extends typeof Gesture>(Type: T, element: Element, handle: ListenerHandle<T>, evt: Event): DefaultGesture | undefined {
    if (!this.matchesHandle(element, handle)) {
      return;
    }
    return this.composeGesture(Type, element, handle, evt);
  }
  private matchHandles(element: Element, gestures: DefaultGesture[], evt: Event): DefaultGesture[] {
    for (const handle of this.handles) { // Always evaluate length since gestures could bind gestures
      const gesture = this.matchHandle(handle.Type, element, handle, evt);
      if (gesture) {
        gestures.push(gesture);
      }
    }
    return gestures;
  }
  private match(target: Node, evt: Event): DefaultGesture[] {
    const gestures: DefaultGesture[] = [];
    for (let node: Node | null = target; node && node.nodeType === 1 && node !== this.element; node = node.parentNode) {
      this.matchHandles(node as Element, gestures, evt);
    }
    return gestures;
  }
}
