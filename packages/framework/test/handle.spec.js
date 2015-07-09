import {Handle} from "../src/handle";

describe("Handle", () => {
  it("should be a constructor", () => {
    expect(Handle).to.throw();
  });

  it("should set element, type, subscriber, active", () => {
    var element = {};
    var type = "foo";
    var subscriber = {};
    var active = false;
    var handle = new Handle(element, type, subscriber, active);
    expect(handle.element).to.equal(element);
    expect(handle.type).to.equal(type);
    expect(handle.subscriber).to.equal(subscriber);
    expect(handle.active).to.equal(active);
  });
});
