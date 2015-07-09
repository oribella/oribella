import {Validator} from "../src/validator";

describe("Validator", () => {
  var validator;

  beforeEach(() => {
    validator = new Validator( () => { return true; } );
  });

  it("should be a constructor", () => {
    expect(Validator).to.throw();
  });

  it("should set isMouse", () => {
    var isMouse = () => {};
    validator = new Validator(isMouse);
    expect(validator.isMouse).to.equal(isMouse);
  });

  it("should determine if it's a valid mouse button", () => {
    expect(validator.isValidMouseButton({ button: 1, which: 1 }, 2)).to.equal(false);
    expect(validator.isValidMouseButton({ button: 1, which: 1 }, 1)).to.equal(true);
    expect(validator.isValidMouseButton({ button: 1, which: 1 }, [1])).to.equal(true);
  });

  it("should determine if there are more touch points then configured", () => {
    expect(validator.hasMoreTouches([1, 2], 1)).to.equal(true);
    expect(validator.hasMoreTouches([1, 2], 2)).to.equal(false);
    expect(validator.hasMoreTouches([1, 2, 3], 4)).to.equal(false);
  });

  it("should determine if there are equal touch points configured", () => {
    expect(validator.hasEqualTouches([1, 2], 1)).to.equal(false);
    expect(validator.hasEqualTouches([1, 2], 2)).to.equal(true);
    expect(validator.hasEqualTouches([1, 2, 3], 4)).to.equal(false);
  });

  it("should validate start action", () => {
    var isMouse = val => { return val; };
    validator = new Validator(isMouse);
    var isValidMouseButtonStub = sinon.stub(validator, "isValidMouseButton", opts => { return opts.retVal; });
    expect(validator.start(true, {}, { retVal: false })).to.equal(false);
    expect(isValidMouseButtonStub.callCount).to.equal(1);
    expect(validator.start(false, { pagePoints: [1, 2] }, { touches: 1 })).to.equal(false);
    expect(validator.start(false, { pagePoints: [1, 2] }, { touches: 2 })).to.equal(true);
  });

  it("should validate update action", () => {
    expect(validator.update({}, { pagePoints: [1, 2] }, { touches: 1 })).to.equal(false);
    expect(validator.update({}, { pagePoints: [1, 2] }, { touches: 2 })).to.equal(true);
    expect(validator.update({}, { pagePoints: [1, 2] }, { touches: 3 })).to.equal(undefined);
  });

  it("should validate end action", () => {
    expect(validator.end({}, { pagePoints: [1, 2] }, { touches: 1 })).to.equal(false);
    expect(validator.end({}, { pagePoints: [1, 2] }, { touches: 2 })).to.equal(true);
    expect(validator.end({}, { pagePoints: [1, 2] }, { touches: 3 })).to.equal(false);
  });
});
