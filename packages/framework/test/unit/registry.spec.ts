import { expect } from 'chai';
import * as sinon from 'sinon';
import { Registry } from '../../src/registry';
import { Gesture, DefaultGesture } from '../../src/gesture';
import { Listener, DefaultListener } from '../../src/listener';
import { GESTURE_STRATEGY_FLAG } from '../../src/utils';
import { Options, Data } from '../../src/utils';

describe('Registry', () => {
  let instance: Registry;
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    instance = new Registry();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should not have any registered gestures', () => {
    expect(instance.getTypes()).to.have.length(0);
  });

  it('should get registered gestures', () => {
    class Foo extends DefaultGesture { }
    class Bar extends DefaultGesture { }
    class Baz extends DefaultGesture { }
    instance.register(Foo, Options);
    instance.register(Bar, Options);
    instance.register(Baz, Options);
    expect(instance.getTypes()).to.deep.equal([Foo, Bar, Baz]);
  });

  it('should register gesture', () => {
    const set = sandbox.stub(instance['gestures'], 'set');
    const MyGesture = {} as typeof Gesture;
    instance.register(MyGesture);
    expect(set).to.have.been.calledWithExactly(MyGesture, { Gesture: MyGesture, GestureOptions: Options, GestureListener: Listener, GestureData: Data });
  });

  it('should register gesture with custom options', () => {
    const set = sandbox.stub(instance['gestures'], 'set');
    const MyGesture = {} as typeof Gesture;
    class MyOptions extends Options { };
    instance.register(MyGesture, MyOptions);
    expect(set).to.have.been.calledWithExactly(MyGesture, { Gesture: MyGesture, GestureOptions: MyOptions, GestureListener: Listener, GestureData: Data });
  });

  it('should register gesture with custom listener', () => {
    const set = sandbox.stub(instance['gestures'], 'set');
    const MyGesture = {} as typeof Gesture;
    class MyListener extends DefaultListener { };
    instance.register(MyGesture, undefined, MyListener);
    expect(set).to.have.been.calledWithExactly(MyGesture, { Gesture: MyGesture, GestureOptions: Options, GestureListener: MyListener, GestureData: Data });
  });

  it('should register gesture with custom data', () => {
    const set = sandbox.stub(instance['gestures'], 'set');
    const MyGesture = {} as typeof Gesture;
    class MyData extends Data { };
    instance.register(MyGesture, undefined, undefined, MyData);
    expect(set).to.have.been.calledWithExactly(MyGesture, { Gesture: MyGesture, GestureOptions: Options, GestureListener: Listener, GestureData: MyData });
  });

  it('should create gesture', () => {
    instance.register(Gesture, Options);
    const gesture = instance.create(Gesture, {} as Element, {} as DefaultListener);
    expect(gesture).to.be.an.instanceOf(Gesture);
  });

  it('should throw if type is not registered when trying to create gesture', () => {
    expect(instance.create.bind(instance, 'foo', {}, {} as Element)).to.throw();
  });

  it('should create default options', () => {
    instance.register(Gesture, Options);
    const listener = {} as DefaultListener;
    const gesture = instance.create(Gesture, {} as Element, listener);
    expect(gesture.listener.options.pointers).to.equal(1);
    expect(gesture.listener.options.which).to.equal(1);
    expect(gesture.listener.options.prio).to.equal(100);
    expect(gesture.listener.options.strategy).to.equal(GESTURE_STRATEGY_FLAG.KEEP);
  });

  it('should create custom options', () => {
    instance.register(Gesture, Options);
    const listener = {
      options: {
        pointers: 100, which: 3, prio: 2, strategy: GESTURE_STRATEGY_FLAG.REMOVE_IF_POINTERS_GT
      }
    } as DefaultListener;
    const gesture = instance.create(Gesture, {} as Element, listener);
    expect(gesture.listener.options.pointers).to.equal(100);
    expect(gesture.listener.options.which).to.equal(3);
    expect(gesture.listener.options.prio).to.equal(2);
    expect(gesture.listener.options.strategy).to.equal(GESTURE_STRATEGY_FLAG.REMOVE_IF_POINTERS_GT);
  });

});
