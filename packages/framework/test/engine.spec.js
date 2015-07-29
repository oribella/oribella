import {Engine} from "../src/engine";
import {MouseFlow} from "../src/flows/mouse";

describe("Engine", () => {

  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
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
    var engine = new Engine(element, registry, validator);
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
    var engine = new Engine({}, registry, {});
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
    var engine = new Engine({}, {}, {});
    engine.addFlow(flow);
    var deactivate = engine.activate();
    expect(flow.activate).to.have.been.calledOnce;
    deactivate();
    expect(stop).to.have.been.calledOnce;
  });

  it("should add/remove handles", () => {
    var engine = new Engine({}, {}, {});
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
    flow.onStart = sandbox.stub().returns(flow),
    flow.onUpdate = sandbox.stub().returns(flow),
    flow.onCancel = sandbox.stub().returns(flow),
    flow.onEnd = sandbox.stub().returns(flow),
    flow.onStop = sandbox.stub().returns(flow)
    var engine = new Engine({}, {}, {});
    expect(engine.addFlow(flow)).to.equal(flow);
    expect(flow.onStart).to.have.been.calledWith(sinon.match.func);
    expect(flow.onUpdate).to.have.been.calledWith(sinon.match.func);
    expect(flow.onCancel).to.have.been.calledWith(sinon.match.func);
    expect(flow.onEnd).to.have.been.calledWith(sinon.match.func);
    expect(flow.onStop).to.have.been.calledWith(sinon.match.func);
  });

  it("should activate a flow", () => {
    var engine = new Engine({}, {}, {});
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
    
  });
});
