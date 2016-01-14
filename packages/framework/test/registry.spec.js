import {Registry} from "../src/registry";

describe("Registry", () => {
  let sandbox;
  let reg;
  class Foo {}
  class Bar {}

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    reg = new Registry();
    reg.register("foo", Foo);
    reg.register("bar", Bar);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should set constructor members", () =>{
    expect(reg.gestures).to.be.an("object");
    expect(Object.keys(reg.gestures)).to.have.length(2);
  });

  it("should `register` a type", () => {
    const ensure = sandbox.stub(reg.defaultGesture, "ensure");
    reg.register("foo", Foo);
    expect(ensure).to.have.been.calledWithExactly(Foo.prototype);
    expect(reg.gestures.foo).to.equal(Foo);
  });

  it("should `getTypes`", () => {
    expect(reg.getTypes()).to.deep.equal(["foo", "bar"]);
  });

  describe("`create`", () => {
    let subscriber;
    let element;

    beforeEach(() => {
      subscriber = { options: {} };
      element = {};
    });

    it("should call `defaultSubscriber.ensure`", () => {
      const ensure = sandbox.stub(reg.defaultSubscriber, "ensure");
      reg.create("foo", subscriber, element);
      expect(ensure).to.have.been.calledWithExactly(subscriber);
    });

    it("should ensure gesture defaults", () => {
      reg.create("foo", subscriber, element);
      expect(subscriber.options).to.deep.equal({ touches: 1, which: 1, prio: 100 });
    });

  });
});
