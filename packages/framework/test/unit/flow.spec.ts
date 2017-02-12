import {expect} from 'chai';
import * as sinon from 'sinon';
import {EventEmitter, Flow, EventConfig} from '../../src/flow';
import {PointerData} from '../../src/utils';

describe('Flow', () => {
  let instance: Flow;
  let sandbox: Sinon.SinonSandbox;
  const element = {} as Element;
  const config = {
    start: new EventConfig(),
    update: new EventConfig(),
    end: new EventConfig(),
    cancel: new EventConfig()
  };

  beforeEach(() => {
    instance = new Flow(element, config);
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should extend EventEmitter', () => {
    expect(instance).to.be.an.instanceOf(EventEmitter);
  });

  it('should bind start', () => {
    config.start = new EventConfig('mousedown');
    const getEvents = sandbox.spy(config.start, 'getEvents');
    const bind = sandbox.spy(instance.addDOMEventListener, 'bind');
    instance.bind(config);
    expect(getEvents).to.have.been.calledOnce;
    expect(bind).to.have.been.calledWithExactly(instance, element, 'mousedown', sinon.match.func);
  });

  it('should return start function', () => {
    config.start = new EventConfig('mousedown');
    const startListen = instance.bind(config).startListen;
    expect(startListen).to.have.length(1);
  });

  it('should return continue function', () => {
    config.update = new EventConfig('mousemove');
    config.end = new EventConfig('mouseup');
    config.cancel = new EventConfig('cancel');
    const continueListen = instance.bind(config).continueListen;
    expect(continueListen).to.have.length(3);
  });

  it('should add start listeners', () => {
    config.start = new EventConfig('mousedown');
    const listenerSpy = sandbox.spy();
    element.addEventListener = listenerSpy;
    const startListen = instance.bind(config).startListen;
    startListen.forEach((f) => f());
    expect(listenerSpy).to.have.been.calledWithExactly('mousedown', sinon.match.func, false);
  });

  it('should proxy', () => {
    const spy = sandbox.spy();
    const evt = {} as Event;
    instance['proxy'](spy, evt);
    expect(spy).to.have.been.calledWithExactly(evt);
  });

  it('should call setPointers for events', () => {
    config.start = new EventConfig('mousedown');
    const listenerSpy = sandbox.spy();
    const evt = {} as Event;
    const setPointersSpy = sandbox.spy(instance, 'setPointers');
    element.addEventListener = listenerSpy;
    const startListen = instance.bind(config).startListen;
    startListen.forEach((f) => f());
    listenerSpy.callArgWith(1, evt);
    expect(setPointersSpy).to.have.been.calledWithExactly(evt);
  });

  it('should add continue listeners', () => {
    config.update = new EventConfig('mousemove');
    config.end = new EventConfig('mouseup');
    config.cancel = new EventConfig('cancel');
    const listenerSpy = sandbox.spy();
    element.addEventListener = listenerSpy;
    const continueListen = instance.bind(config).continueListen;
    continueListen.forEach((f) => f());

    expect(listenerSpy.firstCall).to.have.been.calledWithExactly('mousemove', sinon.match.func, false);
    expect(listenerSpy.secondCall).to.have.been.calledWithExactly('mouseup', sinon.match.func, false);
    expect(listenerSpy.thirdCall).to.have.been.calledWithExactly('cancel', sinon.match.func, false);
  });

  it('should bind update', () => {
    config.start = new EventConfig('mousemove');
    const getEvents = sandbox.spy(config.update, 'getEvents');
    const bind = sandbox.spy(instance.addDOMEventListener, 'bind');
    instance.bind(config);
    expect(getEvents).to.have.been.calledOnce;
    expect(bind).to.have.been.calledWithExactly(instance, element, 'mousemove', sinon.match.func);
  });

  it('should bind end', () => {
    config.start = new EventConfig('mouseup');
    const getEvents = sandbox.spy(config.end, 'getEvents');
    const bind = sandbox.spy(instance.addDOMEventListener, 'bind');
    instance.bind(config);
    expect(getEvents).to.have.been.calledOnce;
    expect(bind).to.have.been.calledWithExactly(instance, element, 'mouseup', sinon.match.func);
  });

  it('should bind cancel', () => {
    config.start = new EventConfig('cancel');
    const getEvents = sandbox.spy(config.cancel, 'getEvents');
    const bind = sandbox.spy(instance.addDOMEventListener, 'bind');
    instance.bind(config);
    expect(getEvents).to.have.been.calledOnce;
    expect(bind).to.have.been.calledWithExactly(instance, element, 'cancel', sinon.match.func);
  });

  it('should activate start listener and return an array of unlisten functions', () => {
    instance.config.start = new EventConfig('mousedown');
    const startListenerSpy = sandbox.spy();
    const removeListenerSpy = sandbox.spy();
    element.addEventListener = startListenerSpy;
    element.removeEventListener = removeListenerSpy;
    const remove = instance.activate();
    expect(remove).to.have.length(1);
    remove.forEach((f) => f());
    expect(removeListenerSpy).to.have.been.calledWithExactly('mousedown', sinon.match.func, false);
  });

  it('should emit start', () => {
    const emitSpy = sandbox.spy(instance, 'emit');
    const e = {} as Event;
    instance.start(e);
    expect(emitSpy).to.have.been.calledWithExactly('start', e, {
      all: new Map<string, PointerData>(),
      changed: new Map<string, PointerData>()
    });
  });

  it('should emit update', () => {
    const emitSpy = sandbox.spy(instance, 'emit');
    const e = {} as Event;
    instance.update(e);
    expect(emitSpy).to.have.been.calledWithExactly('update', e, {
      all: new Map<string, PointerData>(),
      changed: new Map<string, PointerData>()
    });
  });

  it('should emit end', () => {
    const emitSpy = sandbox.spy(instance, 'emit');
    const e = {} as Event;
    instance.allPointers.set(1, {} as PointerData);
    instance.end(e);
    expect(emitSpy).to.have.been.calledWithExactly('end', e, {
      all: new Map<number, PointerData>(),
      changed: new Map<number, PointerData>()
    });
  });

  it('should emit end and call stop', () => {
    const emitSpy = sandbox.spy(instance, 'emit');
    const stopSpy = sandbox.spy(instance, 'stop');
    const e = {} as Event;
    instance.allPointers.clear();
    instance.end(e);
    expect(emitSpy).to.have.been.calledWithExactly('end', e, {
      all: new Map<string, PointerData>(),
      changed: new Map<string, PointerData>()
    });
    expect(stopSpy).to.have.been.calledOnce;
  });

  it('should emit cancel and call stop', () => {
    const emitSpy = sandbox.spy(instance, 'emit');
    const stopSpy = sandbox.spy(instance, 'stop');
    const e = {} as Event;
    instance.cancel(e);
    expect(emitSpy).to.have.been.calledWithExactly('cancel', e, {
      all: new Map<string, PointerData>(),
      changed: new Map<string, PointerData>()
    });
    expect(stopSpy).to.have.been.calledOnce;
  });

  it('should continue', () => {
    const spy1 = sandbox.stub().returns(() => {});
    const spy2 = sandbox.stub().returns(() => {});
    instance.continueListen = [spy1, spy2];
    instance.continue();
    expect(spy1).to.have.been.calledOnce;
    expect(spy2).to.have.been.calledOnce;
    expect(instance.removeListeners).to.have.length(2);
  });

  it('should emit stop and remove listeners', () => {
    const emitSpy = sandbox.spy(instance, 'emit');
    const spy1 = sandbox.spy();
    const spy2 = sandbox.spy();
    instance.removeListeners = [spy1, spy2];
    instance.stop();
    expect(emitSpy).to.have.been.calledWithExactly('stop');
    expect(spy1).to.have.been.calledOnce;
    expect(spy2).to.have.been.calledOnce;
    expect(instance.removeListeners).to.have.length(0);
  });
});
