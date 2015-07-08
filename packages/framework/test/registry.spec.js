import {Registry, DefaultGesture, DefaultSubscriber} from "../src/registry";

describe("Registry", () => {
  var reg;

  beforeEach( () => {
    reg = new Registry();
  });

  it("should set constructor members", () =>{
    expect(reg.gestures).to.be.an("object");
    expect(Object.keys(reg.gestures)).to.have.length(0);
  });

  it("should register a type", () => {
    class Foo {}
    var ensureSpy = sinon.spy(reg, "ensure");
    reg.register("foo", Foo);
    expect(ensureSpy).to.have.been.calledWith(Foo.prototype, DefaultGesture);
    expect(Foo.prototype).to.deep.equal(DefaultGesture);
    expect(reg.gestures.foo).to.equal(Foo);
  });

  it("should get types", () => {
    class Foo {}
    class Bar {}
    reg.register("foo", Foo);
    reg.register("bar", Bar);
    expect(reg.getTypes()).to.deep.equal(["foo", "bar"]);
  });

  it("should create a gesture", () => {
    var ensureSubscriberProtoSpy = sinon.spy(reg, "ensureSubscriberProto");
    var ensureSubscriberOptionsSpy = sinon.spy(reg, "ensureSubscriberOptions");
    var ensureSpy = sinon.spy(reg, "ensure");
    var subscriber = {};
    var element = {};
    var defaultOptions = { foo: "bar" };
    class Foo { static defaultOptions() { return defaultOptions; }}
    reg.register("foo", Foo);
    var gesture = reg.create("foo", subscriber, element);
    expect(ensureSubscriberProtoSpy).to.have.been.calledWith(subscriber);
    expect(ensureSpy).to.have.been.calledWith(subscriber, DefaultSubscriber);
    expect(ensureSubscriberOptionsSpy).to.have.been.calledWith(defaultOptions, subscriber.options);
    expect(gesture).to.be.an.instanceof(Foo);
  });

  it("should ensure subscriber", () => {
    var subscriber = {};
    reg.ensureSubscriberProto(subscriber);
    expect(subscriber).to.deep.equal(DefaultSubscriber);
    expect(subscriber.options).to.be.an("object");
  });

  it("should throw if typeof subscriber is not an object", () =>{
    var subscriber;
    expect(reg.ensureSubscriberProto.bind(reg, subscriber)).to.throw();
    subscriber = () => {};
    expect(reg.ensureSubscriberProto.bind(reg, subscriber)).to.throw();
    subscriber = 1;
    expect(reg.ensureSubscriberProto.bind(reg, subscriber)).to.throw();
    subscriber = "";
    expect(reg.ensureSubscriberProto.bind(reg, subscriber)).to.throw();
  });

  describe("subscriber options", () => {
    var defaultOptions;
    var options;
    beforeEach(() => {
      defaultOptions = {};
      options = {};
    });
    it("should ensure defaults", () => {
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 1, prio: 100 });
    });
    it("should ensure default touches", () => {
      defaultOptions.touches = "2";
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 1, prio: 100 });
      defaultOptions.touches = () => {};
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 1, prio: 100 });
      defaultOptions.touches = {};
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 1, prio: 100 });
      defaultOptions.touches = 10;
      options = {};
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 10, which: 1, prio: 100 });
    });

    it("should ensure default which", () => {
      defaultOptions.which = "2";
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 1, prio: 100 });
      defaultOptions.which = () => {};
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 1, prio: 100 });
      defaultOptions.which = {};
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 1, prio: 100 });
      defaultOptions.which = 10;
      options = {};
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 10, prio: 100 });
    });

    it("should ensure default prio", () => {
      defaultOptions.prio = "2";
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 1, prio: 100 });
      defaultOptions.prio = () => {};
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 1, prio: 100 });
      defaultOptions.prio = {};
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 1, prio: 100 });
      defaultOptions.prio = 10;
      options = {};
      reg.ensureSubscriberOptions(defaultOptions, options);
      expect(options).to.deep.equal({ touches: 1, which: 1, prio: 10 });
    });
  });
});
