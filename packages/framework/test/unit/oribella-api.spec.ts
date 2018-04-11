import { expect } from 'chai';
import * as sinon from 'sinon';
import { OribellaApi } from '../../src/oribella-api';
import { MSPointerFlow } from '../../src/flows/ms-pointer';
import { PointerFlow } from '../../src/flows/pointer';
import { TouchFlow } from '../../src/flows/touch';
import { Gesture } from '../../src/gesture';
import { Listener, DefaultListener } from '../../src/listener';
import { Options, Data, removeListener } from '../../src/utils';

describe('OribellaApi', () => {
  let instance: OribellaApi;
  let sandbox: sinon.SinonSandbox;
  let document: Document;
  const msPointerEnabled = false;
  const pointerEnabled = false;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    document = {} as Document;
    const g = global as any;
    g.window = {
      document,
      ontouchstart: '',
      navigator: {
        msPointerEnabled,
        pointerEnabled,
      },
    };
    instance = new OribellaApi(document);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should use defaults', () => {
    expect(instance['element']).to.equal(document);
  });

  it('should use parameters', () => {
    const element = {} as Element;
    instance = new OribellaApi(element);
    expect(instance['element']).to.equal(element);
  });

  describe('Register default flow strategy', () => {

    it('should register MSPointerFlow', () => {
      const element = {} as Element;
      const supports = { msPointerEnabled: true, pointerEnabled: false, touchEnabled: false };
      instance = new OribellaApi(element);
      const registerFlow = sandbox.stub(instance['engine'], 'registerFlow');
      instance.registerDefaultFlowStrategy(supports);
      expect(registerFlow).to.have.been.calledWithExactly(sinon.match.instanceOf(MSPointerFlow));
    });

    it('should register PointerFlow', () => {
      const element = {} as Element;
      const supports = { msPointerEnabled: false, pointerEnabled: true, touchEnabled: false };
      instance = new OribellaApi(element);
      const registerFlow = sandbox.stub(instance['engine'], 'registerFlow');
      instance.registerDefaultFlowStrategy(supports);
      expect(registerFlow).to.have.been.calledWithExactly(sinon.match.instanceOf(PointerFlow));
    });

    it('should register TouchFlow', () => {
      const element = {} as Element;
      const supports = { msPointerEnabled: false, pointerEnabled: false, touchEnabled: true };
      instance = new OribellaApi(element);
      const registerFlow = sandbox.stub(instance['engine'], 'registerFlow');
      instance.registerDefaultFlowStrategy(supports);
      expect(registerFlow).to.have.been.calledWithExactly(sinon.match.instanceOf(TouchFlow));
    });

  });

  it('should register gesture', () => {
    const registerGesture = sandbox.stub(instance['engine'], 'registerGesture');
    const gesture = {} as typeof Gesture;
    instance.registerGesture(gesture);
    expect(registerGesture).to.have.been.calledWithExactly(gesture, Options, Listener, Data);
  });

  it('should register gesture with custom options', () => {
    const registerGesture = sandbox.stub(instance['engine'], 'registerGesture');
    const gesture = {} as typeof Gesture;
    class MyOptions extends Options {}
    const listener = {} as typeof Listener;
    instance.registerGesture(gesture, MyOptions, listener);
    expect(registerGesture).to.have.been.calledWithExactly(gesture, MyOptions, listener, Data);
  });

  it('should register gesture with custom listener', () => {
    const registerGesture = sandbox.stub(instance['engine'], 'registerGesture');
    const gesture = {} as typeof Gesture;
    const listener = {} as typeof Listener;
    instance.registerGesture(gesture, undefined, listener);
    expect(registerGesture).to.have.been.calledWithExactly(gesture, Options, listener, Data);
  });

  it('should register gesture with custom data', () => {
    const registerGesture = sandbox.stub(instance['engine'], 'registerGesture');
    const gesture = {} as typeof Gesture;
    class MyData extends Data {}
    instance.registerGesture(gesture, undefined, undefined, MyData);
    expect(registerGesture).to.have.been.calledWithExactly(gesture, Options, Listener, MyData);
  });

  it('should activate', () => {
    const deactivateFlows: removeListener[] = [];
    const activate = sandbox.stub(instance['engine'], 'activate').returns(deactivateFlows);
    instance.activate();
    expect(activate).to.have.been.calledWithExactly();
    expect(instance['deactivateFlows']).to.equal(deactivateFlows);
  });

  it('should deactivate', () => {
    const f1 = sandbox.spy();
    const f2 = sandbox.spy();
    const f3 = sandbox.spy();
    const deactivateFlows: removeListener[][] = [[f1, f2, f3]];
    sandbox.stub(instance['engine'], 'activate').returns(deactivateFlows);
    instance.activate();
    instance.deactivate();
    expect(f1).to.have.been.calledWithExactly();
    expect(f2).to.have.been.calledWithExactly();
    expect(f3).to.have.been.calledWithExactly();
  });

  it('should deactivate', () => {
    const activate = sandbox.stub(instance['engine'], 'activate');
    instance.deactivate();
    expect(activate.callCount).to.equal(0);
  });

  it('should register listeners', () => {
    const element = {} as Element;
    const listener = {} as DefaultListener;
    const registerListener = sandbox.stub(instance['engine'], 'registerListener');
    instance.on(Gesture, element, listener);
    expect(registerListener).to.have.been.calledWithExactly(Gesture, element, listener);
  });

});
