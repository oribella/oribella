import {Point} from "../src/point";

describe("Point", () => {

  it("should create a point with x and y", () =>{
    var p = new Point(0, 0);
    expect(p.x).to.equal(0);
    expect(p.y).to.equal(0);
  });

});
