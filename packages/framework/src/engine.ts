import { Registry } from './registry';
import { Gesture, GestureFactory } from './gesture';
import { ListenerFactory, Listener } from './listener';
import { Flow } from './flow';
import {
  Options,
  OptionsFactory,
  Data,
  DataFactory,
  Pointers,
  PointerDataMap,
  PointerData,
  isMouse,
  isValidMouseButton,
  RETURN_FLAG,
  GESTURE_STRATEGY_FLAG,
  matchesSelector,
} from './utils';
import { ListenerHandle, DefaultListenerHandle } from './listener-handle';

export interface PointersDelta {
  all: number;
  changed: number;
}
export interface ExecStrategyState {
  evt: Event;
  gestures: Gesture[];
  gesture: Gesture;
  pointers: Pointers;
  pointersDelta: PointersDelta;
}
export type ExecStrategy = (state: ExecStrategyState) => number;

export class Engine {
  public flows: Flow[] = [];
  public activeFlow: Flow | null = null;
  public handles: DefaultListenerHandle[] = [];
  public gestures: Gesture[] = [];
  public composedGestures: Gesture[] = [];

  constructor(public element: Element | Document, public registry: Registry = new Registry()) {}

  public registerGesture<
    G extends Gesture<O, D, L>,
    O extends Options,
    D extends Data,
    // tslint:disable-next-line:variable-name
    L extends Listener<O, D>
  >(
    GestureClass: GestureFactory<G, O, D, L>,
    GestureOptions: OptionsFactory = Options,
    GestureListener: ListenerFactory<O, D> = Listener,
    GestureData: DataFactory = Data
  ) {
    this.registry.register(GestureClass, GestureOptions, GestureListener, GestureData);
  }
  public registerFlow(flow: Flow) {
    this.flows.push(flow);
    flow.on('start', (e: Event, p: Pointers) => this.onStart(flow, e, p));
    flow.on('update', (e: Event, p: Pointers) => this.onUpdate(flow, e, p));
    flow.on('end', (e: Event, p: Pointers) => this.onEnd(flow, e, p));
    flow.on('cancel', (e: Event, p: Pointers) => this.onCancel(flow, e, p));
    flow.on('stop', () => this.onStop());
  }
  public registerListener<
    G extends Gesture<O, D, L>,
    O extends Options,
    D extends Data,
    // tslint:disable-next-line:variable-name
    L extends Listener<O, D>
  >(GestureClass: GestureFactory<G, O, D, L>, element: Element, listener: L): () => void {
    const handle = new ListenerHandle(GestureClass, element, listener);

    this.handles.push(handle);

    return () => {
      const ix = this.handles.indexOf(handle);
      if (ix !== -1) {
        this.handles.splice(ix, 1);
      }
    };
  }
  public activate() {
    return this.flows.map(f => f.activate());
  }
  public canActivateFlow(flow: Flow) {
    return this.activeFlow === null || this.activeFlow === flow;
  }
  public getPointersDelta(
    evt: Event,
    pointers: Pointers,
    configuredPointers: number,
    configuredWhich: number[] | number
  ): PointersDelta {
    if (isMouse(evt) && !isValidMouseButton(evt as MouseEvent, configuredWhich)) {
      return { all: -1, changed: -1 };
    }
    const all = pointers.all.size - configuredPointers;
    const changed = pointers.changed.size - configuredPointers;
    return { all, changed };
  }
  public removeGesture(gesture: Gesture, ...arr: Gesture[][]) {
    if (gesture.startEmitted) {
      gesture.cancel();
    }
    gesture.unbind();
    let gestures;
    while ((gestures = arr.shift())) {
      const ix = gestures.indexOf(gesture);
      if (ix !== -1) {
        gestures.splice(ix, 1);
      }
    }
  }
  public evaluateStrategyReturnFlag(gesture: Gesture, flag: number) {
    if (flag & RETURN_FLAG.START_EMITTED) {
      gesture.startEmitted = true;
    }
    if (flag & RETURN_FLAG.REMOVE) {
      this.removeGesture(gesture, this.gestures, this.composedGestures);
    }
    if (flag & RETURN_FLAG.REMOVE_OTHERS) {
      const others = this.gestures.slice();
      let otherGesture;
      while ((otherGesture = others.shift())) {
        if (gesture === otherGesture) {
          continue;
        }
        this.removeGesture(otherGesture, this.gestures, this.composedGestures);
      }
    }
  }
  public whileGestures(evt: Event, gestures: Gesture[], pointers: Pointers, execStrategy: ExecStrategy) {
    let gesture;
    while ((gesture = gestures.shift())) {
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
  public addPointerId(gesture: Gesture, pointerId: number) {
    gesture.__POINTERIDS__.push(pointerId);
  }
  public removePointerIds(map: PointerDataMap, gesture: Gesture, changed: number[]) {
    const pointerIds = this.getPointerIds(gesture);
    let pointerId;
    while ((pointerId = changed.shift())) {
      const ix = pointerIds.indexOf(pointerId);
      if (ix !== -1) {
        const removed = pointerIds.splice(ix, 1)[0];
        const pointer = this.getPointer(map, removed);
        gesture.__REMOVED_POINTERS__.push(pointer);
      }
    }
  }
  public getPointerIds(gesture: Gesture) {
    return gesture.__POINTERIDS__;
  }
  public getRemovedPointers(gesture: Gesture) {
    return gesture.__REMOVED_POINTERS__;
  }
  public getPointer(map: PointerDataMap, pointerId: number): PointerData {
    return map.get(pointerId) as PointerData;
  }
  public getPointers(map: PointerDataMap, pointerIds: number[]): PointerData[] {
    return pointerIds.map(pointerId => this.getPointer(map, pointerId));
  }
  public isLockedPointers(gesture: Gesture, map: PointerDataMap): boolean {
    const pointerIds = this.getPointerIds(gesture);
    return pointerIds.filter(pointerId => map.has(pointerId)).length === map.size;
  }
  public startStrategy(state: ExecStrategyState): number {
    if (state.pointersDelta.all !== 0) {
      return RETURN_FLAG.IDLE;
    }
    // Lock pointer ids on gesture
    state.pointers.all.forEach((_, pointerId) => this.addPointerId(state.gesture, pointerId));
    state.gesture.args.data.pointers = this.getPointers(state.pointers.all, this.getPointerIds(state.gesture));
    state.gesture.args.evt = state.evt;
    return state.gesture.start(state.gesture.args);
  }
  public updateStrategy(state: ExecStrategyState): number {
    if (!this.isLockedPointers(state.gesture, state.pointers.all)) {
      return RETURN_FLAG.IDLE;
    }
    state.gesture.args.data.pointers = this.getPointers(state.pointers.all, this.getPointerIds(state.gesture));
    state.gesture.args.evt = state.evt;
    return state.gesture.update(state.gesture.args);
  }
  public endStrategy(state: ExecStrategyState): number {
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
  public cancelStrategy(state: ExecStrategyState): number {
    return state.gesture.cancel();
  }
  public onStart(flow: Flow, evt: Event, pointers: Pointers): boolean {
    if (!this.canActivateFlow(flow)) {
      return false;
    }
    this.activeFlow = flow;
    this.activeFlow.continue();

    this.gestures = this.gestures.concat(this.match(evt.target as Node, evt)).sort((g1, g2) => {
      return g1.listener.options.prio - g2.listener.options.prio;
    });

    if (!this.gestures.length) {
      return false; // No match don't continue
    }

    this.whileGestures(evt, this.gestures.slice(), pointers, this.startStrategy.bind(this));

    return true;
  }
  public onUpdate(flow: Flow, evt: Event, pointers: Pointers) {
    if (this.activeFlow !== flow) {
      return;
    }
    this.whileGestures(evt, this.gestures.slice(), pointers, this.updateStrategy.bind(this));
  }
  public onEnd(flow: Flow, evt: Event, pointers: Pointers) {
    if (this.activeFlow !== flow) {
      return;
    }
    this.whileGestures(evt, this.gestures.slice(), pointers, this.endStrategy.bind(this));
  }
  public onCancel(flow: Flow, evt: Event, pointers: Pointers) {
    if (this.activeFlow !== flow) {
      return;
    }
    this.whileGestures(evt, this.gestures.slice(), pointers, this.cancelStrategy.bind(this));
  }
  public onStop() {
    const gestures = this.gestures.slice();
    let gesture;

    // Check for composing gestures for example Doubletap
    while ((gesture = gestures.shift())) {
      if (RETURN_FLAG.COMPOSE === gesture.unbind()) {
        this.composedGestures.push(gesture);
      } else {
        gesture.stop();
      }
    }

    this.gestures.length = 0;
    this.activeFlow = null;
  }
  public addGesture<
    G extends Gesture<O, D, L>,
    O extends Options,
    D extends Data,
    // tslint:disable-next-line:variable-name
    L extends Listener<O, D>
  >(
    GestureClass: GestureFactory<G, O, D, L>,
    element: Element,
    handle: ListenerHandle<G, O, D, L>,
    evt: Event
  ): Gesture {
    const gesture = this.registry.create(GestureClass, element, handle.listener);
    gesture.bind(
      handle.element,
      this.registerListener.bind(this),
      this.removeGesture.bind(this, gesture, this.gestures, this.composedGestures),
      evt
    );
    return gesture;
  }
  public composeGesture<
    G extends Gesture<O, D, L>,
    O extends Options,
    D extends Data,
    // tslint:disable-next-line:variable-name
    L extends Listener<O, D>
  >(
    GestureClass: GestureFactory<G, O, D, L>,
    element: Element,
    handle: ListenerHandle<G, O, D, L>,
    evt: Event
  ): Gesture {
    let gesture;
    while ((gesture = this.composedGestures.shift())) {
      if (gesture.listener === handle.listener) {
        break;
      }
    }
    if (!gesture) {
      gesture = this.addGesture(GestureClass, element, handle, evt);
    }
    return gesture;
  }
  public matchesHandle<G extends Gesture<O, D, L>, O extends Options, D extends Data, L extends Listener<O, D>>(
    element: Element,
    handle: ListenerHandle<G, O, D, L>
  ): boolean {
    const {
      element: refElement,
      listener: { selector },
    } = handle;

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
  public matchHandle<
    G extends Gesture<O, D, L>,
    O extends Options,
    D extends Data,
    // tslint:disable-next-line:variable-name
    L extends Listener<O, D>
  >(
    GestureClass: GestureFactory<G, O, D, L>,
    element: Element,
    handle: ListenerHandle<G, O, D, L>,
    evt: Event
  ): Gesture | undefined {
    if (!this.matchesHandle(element, handle)) {
      return;
    }
    return this.composeGesture(GestureClass, element, handle, evt);
  }
  public matchHandles(element: Element, gestures: Gesture[], evt: Event): Gesture[] {
    for (const handle of this.handles) {
      // Always evaluate length since gestures could bind gestures
      const gesture = this.matchHandle(handle.GestureClass, element, handle, evt);
      if (gesture) {
        gestures.push(gesture);
      }
    }
    return gestures;
  }
  public match(target: Node, evt: Event): Gesture[] {
    const gestures: Gesture[] = [];
    for (let node: Node | null = target; node && node.nodeType === 1 && node !== this.element; node = node.parentNode) {
      this.matchHandles(node as Element, gestures, evt);
    }
    return gestures;
  }
}
