import {Engine, ACTION_START, ACTION_UPDATE, ACTION_END} from "../src/engine";
import {MouseFlow} from "../src/flows/mouse";
import {Validator} from "../src/validator";
import {GESTURE_STARTED} from "../src/utils";

describe("Engine", () => {

  var sandbox;
  var engine;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    engine = new Engine({}, {}, {});
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should be a constructor", () => {
    expect(Engine).to.throw();
  });

  it("should set constructor members", () => {
    var element = {};
    var registry = {};
    var validator = {};
    engine = new Engine(element, registry, validator);
    expect(engine.element).to.equal(element);
    expect(engine.registry).to.equal(registry);
    expect(engine.validator).to.equal(validator);
    expect(engine.flows).to.have.length(0);
    expect(engine.activeFlow).to.be.a("null");
    expect(engine.handles).to.have.length(0);
    expect(engine.gestures).to.have.length(0);
    expect(engine.composedGestures).to.have.length(0);
  });

  it("should register a gesture", () => {
    var registry = {
      register: sandbox.spy()
    };
    engine = new Engine({}, registry, {});
    engine.registerGesture("foo", {});
    expect(registry.register).to.have.been.calledWith("foo", {});
  });

  it("should activate/deactivate flows", () => {
    var stop = sandbox.spy();
    var flow = {
      activate: sandbox.stub().returns(stop),
      onStart() { return this; },
      onUpdate() { return this; },
      onCancel() { return this; },
      onEnd() { return this; },
      onStop() { return this; }
    };
    engine.addFlow(flow);
    var deactivate = engine.activate();
    expect(flow.activate.callCount).to.equal(1);
    deactivate();
    expect(stop.callCount).to.equal(1);
  });

  it("should add/remove handles", () => {
    engine.addHandle({}, "foo", {});
    expect(engine.handles).to.have.length(1);
    var remove = engine.addHandle({}, "bar", {});
    engine.addHandle({}, "baz", {});
    expect(engine.handles).to.have.length(3);
    var spliceSpy = sandbox.spy(engine.handles, "splice");
    remove();
    expect(spliceSpy).to.have.been.calledWith(1, 1);
    expect(engine.handles).to.have.length(2);
  });

  it("should add a flow", () => {
    var flow = {};
    flow.onStart = sandbox.stub().returns(flow);
    flow.onUpdate = sandbox.stub().returns(flow);
    flow.onCancel = sandbox.stub().returns(flow);
    flow.onEnd = sandbox.stub().returns(flow);
    flow.onStop = sandbox.stub().returns(flow);
    expect(engine.addFlow(flow)).to.equal(flow);
    expect(flow.onStart).to.have.been.calledWith(sinon.match.func);
    expect(flow.onUpdate).to.have.been.calledWith(sinon.match.func);
    expect(flow.onCancel).to.have.been.calledWith(sinon.match.func);
    expect(flow.onEnd).to.have.been.calledWith(sinon.match.func);
    expect(flow.onStop).to.have.been.calledWith(sinon.match.func);
  });

  it("should activate a flow", () => {
    var mouseFlow = new MouseFlow({}, {});
    engine.activeFlow = mouseFlow;
    expect(engine.canActivateFlow(mouseFlow)).to.equal(true);
    var flow = {};
    engine.activeFlow = flow;
    expect(engine.canActivateFlow(flow)).to.equal(true);
    engine.activeFlow = null;
    expect(engine.canActivateFlow(flow)).to.equal(true);
    engine.activeFlow = flow;
    expect(engine.canActivateFlow({})).to.equal(false);
  });

  it("should start a flow", () => {
    engine.canActivateFlow = sandbox.stub().returns(false);
    expect(engine.startFlow({}, {}, {})).to.equal(false);

    engine.canActivateFlow = sandbox.stub().returns(true);
    engine.match = sandbox.stub().returns([]);
    expect(engine.startFlow({}, {}, {})).to.equal(false);

    engine.match = sandbox.stub().returns([{}]);
    engine.processEvent = sandbox.stub();
    expect(engine.startFlow({}, {}, {})).to.equal(true);
    expect(engine.processEvent).to.have.been.calledWith({}, {}, {}, ACTION_START);
  });

  it("should update a flow", () => {
    engine.processEvent = sandbox.stub();
    engine.updateFlow({}, {}, {});
    expect(engine.processEvent).to.have.been.calledWith({}, {}, {}, ACTION_UPDATE);
  });

  it("should cancel a flow", () => {
    engine.processEvent = sandbox.stub();
    engine.cancelFlow({}, {}, {});
    expect(engine.processEvent).to.have.been.calledWith({}, {}, {}, "cancel");
  });

  it("should end a flow", () => {
    engine.processEvent = sandbox.stub();
    engine.endFlow({}, {}, {});
    expect(engine.processEvent).to.have.been.calledWith({}, {}, {}, ACTION_END);
  });

  it("should stop a flow", () => {
    engine.handles = [{}, {}, {}];
    var g1 = { unbind: sandbox.stub().returns(true) };
    var g2 = { unbind: sandbox.stub().returns(false) };
    engine.gestures = [g1, g2];
    engine.stopFlow();
    expect(engine.gestures).to.have.length(0);
    expect(g1.unbind.callCount).to.equal(1);
    expect(g2.unbind.callCount).to.equal(1);
    expect(engine.composedGestures).to.have.length(1);
    expect(engine.activeFlow).to.be.a("null");
    engine.handles.forEach(handle => expect(handle.active).to.equal(false));
  });

  it("should remove a gesture", () => {
    var gesture = { unbind: sandbox.spy() };
    engine.gestures = [{}, gesture, {}];
    engine.composedGestures = [{}, {}, {}, {}, gesture, {}];
    var gestureSpy = sandbox.spy( engine.gestures, "splice");
    var composedSpy = sandbox.spy( engine.composedGestures, "splice");
    engine.removeGesture(gesture);
    expect(gesture.unbind.callCount).to.equal(1);
    expect(gestureSpy).to.have.been.calledWith(1, 1);
    expect(composedSpy).to.have.been.calledWith(4, 1);
    gesture.unbind.reset();
    gestureSpy.reset();
    composedSpy.reset();
    engine.removeGesture({ unbind() {}});
    expect(gestureSpy.callCount).to.equal(0);
    expect(composedSpy.callCount).to.equal(0);
  });

  describe("process event", () => {
    var validator;
    var validateStartStub;
    var validateUpdateStub;
    var validateEndStub;

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      validator = new Validator();
      validateStartStub = sandbox.stub(validator, ACTION_START);
      validateUpdateStub = sandbox.stub(validator, ACTION_UPDATE);
      validateEndStub = sandbox.stub(validator, ACTION_END);
      engine = new Engine({}, {}, validator);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should return false for flows not matching the active flow", () => {
      engine.activeFlow = {};
      expect(engine.processEvent({})).to.equal(false);
    });

    it("should return true for flows matching the active flow", () => {
      var flow = {};
      engine.activeFlow = flow;
      expect(engine.processEvent(flow, {}, [], "")).to.equal(true);
    });

    it("should validate actions", () => {
      var gesture = { subscriber: { options: {} } };
      var e = {};
      var data = [];
      var flow = {};
      engine.activeFlow = flow;
      engine.gestures = [gesture];
      engine.processEvent(flow, e, data, ACTION_START);
      expect(validateStartStub).to.have.have.been.calledWith(e, data, gesture.subscriber.options);

      engine.processEvent(flow, e, data, ACTION_UPDATE);
      expect(validateUpdateStub).to.have.have.been.calledWith(e, data, gesture.subscriber.options);

      engine.processEvent(flow, e, data, ACTION_END);
      expect(validateEndStub).to.have.have.been.calledWith(e, data, gesture.subscriber.options);
    });

    it("should set a gesture as started", () => {
      validateStartStub.returns(true);
      var gesture = { start: sandbox.stub(), subscriber: { options: {} } };
      var e = {};
      var flow = {};
      engine.activeFlow = flow;
      engine.gestures = [gesture];
      gesture.start.returns(1);
      engine.processEvent(flow, e, [], ACTION_START);
      expect(gesture[GESTURE_STARTED]).to.equal(true); //eslint-disable-line no-underscore-dangle
    });

    it("should remove a gesture", () => {
      validateUpdateStub.returns(true);
      var gesture = { unbind() {}, update: sandbox.stub(), subscriber: { options: {} } };
      var e = {};
      var flow = {};
      engine.activeFlow = flow;
      engine.gestures = [gesture];
      gesture.update.returns(2);
      engine.processEvent(flow, e, [], ACTION_UPDATE);
      expect(engine.gestures).to.have.length(0);
    });

    it("should remove other gestures", () => {
      validateUpdateStub.returns(true);
      var gesture = { unbind() {}, update: sandbox.stub(), subscriber: { options: {} } };
      var otherGesture1 = { unbind() {}, update: sandbox.stub(), cancel: sandbox.spy(), subscriber: { options: {} } };
      otherGesture1[GESTURE_STARTED] = true;
      var otherGesture2 = { unbind() {}, update: sandbox.stub(), subscriber: { options: {} } };
      var e = {};
      var flow = {};
      engine.activeFlow = flow;
      engine.gestures = [otherGesture1, gesture, otherGesture2];
      gesture.update.returns(4);
      otherGesture1.update.returns(0);
      otherGesture2.update.returns(0);
      engine.processEvent(flow, e, [], ACTION_UPDATE);
      expect(engine.gestures).to.have.length(1);
      expect(engine.gestures[0]).to.equal(gesture);
      expect(otherGesture1.cancel.callCount).to.equal(1);
    });
  });

  it("should create a gesture", () => {
    var handler = { type: "foo", subscriber: {} };
    var element = {};
    var gesture = { bind: sandbox.spy() };
    var registry = { create: sandbox.stub().returns(gesture) };
    engine.registry = registry;
    expect(engine.createGesture(handler, element)).to.equal(gesture);
    expect(registry.create).to.have.been.calledWith("foo", handler.subscriber, element);
    expect(gesture.bind).to.have.been.calledWith(sinon.match.func, handler.element, sinon.match.func);
  });

});
