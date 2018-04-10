import {Loader as loader} from "jspm";
let System = loader();

describe("Sortable", () => {
  let sandbox;
  let Sortable;
  let sortable;
  let Container;
  let container;
  let TemplatingEngine;
  let templatingEngine;
  let MockElement = () => {};

  before(() => {
    return System.import("aurelia-dependency-injection").then( mod => {
      Container = mod.Container;
    }).then(() => {
      return System.import("aurelia-pal").then(pal => {
        pal.initializePAL((platform, feature, dom) => {
          dom.Element = MockElement;
          dom.createMutationObserver = function() { return { observe(){} }; };
          dom.createElement = function() {
            return {
              firstChild: {
                firstElementChild: {}
              }
            };
          };
          dom.createTextNode = function() { return {}; };
        });
      });
    }).then(() => {
      return System.import("aurelia-templating").then(tmpl => {
        TemplatingEngine = tmpl.TemplatingEngine;
      });
    }).then(() => {
      return System.import("./src/sortable").then(mod => {
        Sortable = mod.Sortable;
      });
    });
  });

  beforeEach(() => {
    container = new Container();
    templatingEngine = container.get(TemplatingEngine);
    sortable = templatingEngine.createViewModelForUnitTest(Sortable);
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe( "Constructor", () => {

    it("should set element", () => {
      expect(sortable.element).to.be.an("object");
    });

    it("should set drag", () => {
      return System.import("./src/drag").then(mod => {
        expect(sortable.drag).to.be.an.instanceof(mod.Drag);
      });
    });

    it("should set autoScroll", () => {
      return System.import("./src/auto-scroll").then(mod => {
        expect(sortable.autoScroll).to.be.an.instanceof(mod.AutoScroll);
      });
    });

    it("should set selector", () => {
      expect(sortable.selector).to.equal("[sortable-item]");
    });

    it("should set fromIx", () => {
      expect(sortable.fromIx).to.equal(-1);
    });

    it("should set toIx", () => {
      expect(sortable.toIx).to.equal(-1);
    });

  });

  describe( "Defaults", () =>{

    it("should set scroll speed", () => {
      expect(sortable.scrollSpeed).to.equal(10);
    });

    it("should set scroll sensitivity", () => {
      expect(sortable.scrollSensitivity).to.equal(10);
    });

    it("should set items", () => {
      expect(sortable.items).to.have.length(0);
    });

    it("should set placeholder", () => {
      expect(sortable.placeholder).to.deep.equal({ placeholderClass: "placeholder", style: {} });
    });

    it("should set axis", () => {
      expect(sortable.axis).to.have.length(0);
    });

    it("should have a bounding rect", () => {
      expect(sortable.boundingRect).to.be.a("null");
    });

    it("should have a moved function", () => {
      expect(sortable.moved).to.be.a("function");
    });

    it("should set dragZIndex", () => {
      expect(sortable.dragZIndex).to.equal(1);
    });

    it("should set disallowedDragTagNames", () => {
      expect(sortable.disallowedDragTagNames).to.deep.equal(["INPUT", "SELECT", "TEXTAREA"]);
    });

    it("should have a allowDrag function", () => {
      expect(sortable.allowDrag).to.be.a("function");
    });

    it("should have a allowMove function", () => {
      expect(sortable.allowMove).to.be.a("function");
    });

  });

  describe("`activate`", () => {
    let oribella;
    let removeGestureFn = () => {};
    let removeScrollFn = () => {};
    let on;
    let bindScroll;
    let closest;
    let mockElement = {};
    let mockScroll = {};

    before(() => {
      return System.import("oribella-default-gestures").then(mod => {
        oribella = mod.oribella;
      });
    });

    beforeEach(() => {
      sortable.element = mockElement;
      on = sandbox.stub(oribella, "on").returns(removeGestureFn);
      bindScroll = sandbox.stub(sortable, "bindScroll").returns(removeScrollFn);
      closest = sandbox.stub(sortable, "closest").returns(mockScroll);
    });

    it("should add a oribella swipe listener", () => {
      sortable.activate();
      expect(on).to.have.been.calledWith({}, "swipe", sortable);
      expect(sortable.removeListener).to.equal(removeGestureFn);
    });

    it("should find closest scroll if a selector was bound", () => {
      sortable.scroll = "foo";
      sortable.activate();
      expect(closest).to.have.been.calledWith(mockElement, "foo");
    });

    it("should default scroll to injected element", () => {
      sortable.activate();
      expect(sortable.scroll).to.equal(mockElement);
    });

    it("should add a scroll listener", () => {
      sortable.activate();
      expect(bindScroll).to.have.been.calledWith(mockElement, sinon.match.func);
      expect(sortable.removeScroll).to.equal(removeScrollFn);
    });

  });

  describe("`deactivate`", () => {

    it("should remove oribella swipe listener", () => {
      let removeListener = sandbox.stub();
      sortable.removeListener = removeListener;
      sortable.deactivate();
      expect(removeListener).to.have.been.calledWithExactly();
    });

    it("should not throw if typeof removeListener isn't a function", () => {
      sortable.removeListener = null;
      expect(sortable.deactivate.bind(sortable)).not.to.throw();
    });

    it("should remove scroll listener", () => {
      let removeScroll = sandbox.stub();
      sortable.removeScroll = removeScroll;
      sortable.deactivate();
      expect(removeScroll).to.have.been.calledWithExactly();
    });

    it("should not throw if typeof removeScroll isn't a function", () => {
      sortable.removeScroll = null;
      expect(sortable.deactivate.bind(sortable)).not.to.throw();
    });

  });

  describe("`attached`", () => {

    it("should call activate", () => {
      let activate = sandbox.stub(sortable, "activate");
      sortable.attached();
      expect(activate).to.have.been.calledWithExactly();
    });

  });

  describe("detached", () => {

    it("should call deactivate", () => {
      let deactivate = sandbox.stub(sortable, "deactivate");
      sortable.detached();
      expect(deactivate).to.have.been.calledWithExactly();
    });

  });

  describe("`bindScroll`", () => {
    let mockElement;
    let onScroll;

    beforeEach(() => {
      mockElement = { addEventListener: sandbox.stub(), removeEventListener: sandbox.stub() };
      onScroll = sandbox.stub();
    });

    it("should add scroll listener", () => {
      sortable.bindScroll(mockElement, onScroll);
      expect(mockElement.addEventListener).to.have.been.calledWithExactly("scroll", onScroll, false);
    });

    it("should remove scroll listener", () => {
      let removeScroll = sortable.bindScroll(mockElement, onScroll);
      removeScroll();
      expect(mockElement.removeEventListener).to.have.been.calledWithExactly("scroll", onScroll, false);
    });

  });

  describe("`onScroll`", () => {
    let dragUpdate;
    let getPoint;
    let tryMove;

    beforeEach(() => {
      sortable.drag.element = {};
      sortable.scroll = {};
      sortable.pageX = 100;
      sortable.pageY = 200;
      sortable.axis = "foo";
      dragUpdate = sandbox.stub(sortable.drag, "update");
      getPoint = sandbox.stub(sortable, "getPoint").returns({ x: 0, y: 0 });
      tryMove = sandbox.stub(sortable, "tryMove");
    });

    it("should do a quick return if not dragging", () => {
      sortable.drag.element = null;
      sortable.onScroll();
      expect(dragUpdate).to.have.callCount(0);
      expect(getPoint).to.have.callCount(0);
      expect(tryMove).to.have.callCount(0);
    });

    it("should call `drag.update`", () => {
      sortable.onScroll();
      expect(dragUpdate).to.have.been.calledWithExactly(100, 200, {}, "foo");
    });

    it("should call `getPoint`", () => {
      sortable.onScroll();
      expect(getPoint).to.have.been.calledWithExactly(100, 200);
    });

    it("should call `tryMove`", () => {
      getPoint.returns({ x: 300, y: 400 });
      sortable.onScroll();
      expect(tryMove).to.have.been.calledWithExactly(300, 400);
    });

  });

  describe("`hide`", () => {

    it("should set display none", () => {
      let mockElement = { style: { display: "block" } };
      sortable.hide(mockElement);
      expect(mockElement.style.display).to.equal("none");
    });

    it("should reset display", () => {
      let mockElement = { style: { display: "block" } };
      let showFn = sortable.hide(mockElement);
      showFn();
      expect(mockElement.style.display).to.equal("block");
    });

  });

  describe("`getItemViewModel`", () => {

    it("should get item model", () => {
      let viewModel = {};
      let mockElement = { au: { "sortable-item": { viewModel: viewModel } } };
      expect(sortable.getItemViewModel(mockElement)).to.equal(viewModel);
    });

  });

  describe("placeholder", () => {
    let splice;
    let indexOf;
    let move;

    beforeEach(() => {
      splice = sandbox.stub(sortable.items, "splice");
      indexOf = sandbox.stub(sortable.items, "indexOf");
      move = sandbox.stub(sortable, "move");
    });

    it("should add a placeholder", () => {
      sortable.addPlaceholder(13);
      expect(splice).to.have.been.calledWithExactly(13, 0, sortable.placeholder);
    });

    it("should remove placeholder", () => {
      indexOf.returns(5);
      sortable.removePlaceholder();
      expect(splice).to.have.been.calledWithExactly(5, 1);
    });

    it("should move placeholder", () => {
      indexOf.returns(5);
      sortable.movePlaceholder(8);
      expect(move).to.have.been.calledWithExactly(5, 8);
    });

  });

  describe("`move`", () => {
    let splice;

    beforeEach(() => {
      splice = sandbox.stub(sortable.items, "splice", () => { return [5]; });
    });

    it("should move an item", () => {
      sortable.move(2, 7);
      expect(splice.getCall(0)).to.have.been.calledWithExactly(2, 1);
      expect(splice.getCall(1)).to.have.been.calledWithExactly(7, 0, 5);
    });

  });

  describe("`tryUpdate`", () => {
    let hide;
    let tryMove;
    let showFn;
    let mockElement = {};

    beforeEach(() => {
      showFn = sandbox.spy();
      hide = sandbox.stub(sortable, "hide", () => { return showFn; });
      tryMove = sandbox.stub(sortable, "tryMove");
    });

    it("should hide drag element", () => {
      sortable.drag.element = mockElement;
      sortable.tryUpdate();
      expect(hide).to.have.been.calledWithExactly(mockElement);
    });

    it("should show the drag element", () => {
      sortable.drag.element = mockElement;
      sortable.tryUpdate();
      expect(showFn).to.have.callCount(1);
    });

    it("should call `tryMove`", () => {
      sortable.tryUpdate(100, 200);
      expect(tryMove).to.have.been.calledWithExactly(100, 200);
    });

  });

  describe("`tryMove`", () => {
    let mockElement = {};
    let mockElementFromPoint = {};
    let mockSelector = "foo";
    let elementFromPoint;
    let closest;
    let getItemViewModel;
    let movePlaceholder;
    let allowMove;

    beforeEach(() => {
      allowMove = sandbox.stub().returns(true);
      sortable = Object.create(sortable, {
        "allowMove": {
          value: allowMove
        }
      });

      elementFromPoint = sandbox.stub();
      global.document = { elementFromPoint: elementFromPoint };
      closest = sandbox.stub(sortable, "closest");
      getItemViewModel = sandbox.stub(sortable, "getItemViewModel");
      movePlaceholder = sandbox.stub(sortable, "movePlaceholder");
    });

    afterEach(() => {
      delete global.document;
    });

    it("should call `elementFromPoint`", () => {
      sortable.tryMove(100, 200);
      expect(elementFromPoint).to.have.been.calledWithExactly(100, 200);
    });

    it("should do a quick return if `elementFromPoint` returns falsy", () => {
      elementFromPoint.returns(null);
      sortable.tryMove(100, 200);
      expect(elementFromPoint).to.have.callCount(1);
      expect(closest).to.have.callCount(0);
      expect(getItemViewModel).to.have.callCount(0);
      expect(movePlaceholder).to.have.callCount(0);
    });

    it("should call `closest`", () => {
      elementFromPoint.returns(mockElementFromPoint);
      sortable.element = mockElement;
      sortable.selector = mockSelector;
      sortable.tryMove(100, 200);
      expect(closest).to.have.been.calledWithExactly(mockElementFromPoint, mockSelector, mockElement);
    });

    it("should do a quick return if `closest` returns falsy", () => {
      elementFromPoint.returns(mockElementFromPoint);
      closest.returns(null);
      sortable.tryMove(100, 200);
      expect(elementFromPoint).to.have.callCount(1);
      expect(closest).to.have.callCount(1);
      expect(getItemViewModel).to.have.callCount(0);
      expect(movePlaceholder).to.have.callCount(0);
    });

    it("should call `getItemViewModel`", () => {
      elementFromPoint.returns(mockElementFromPoint);
      closest.returns(mockElementFromPoint);
      getItemViewModel.returns({ item: {}, ctx: {} });
      sortable.tryMove(100, 200);
      expect(getItemViewModel).to.have.been.calledWithExactly(mockElementFromPoint);
    });

    it("should call `allowMove`", () => {
      let item = {};
      elementFromPoint.returns(mockElementFromPoint);
      closest.returns(mockElementFromPoint);
      getItemViewModel.returns({ item: item, ctx: {} });
      sortable.tryMove(100, 200);
      expect(allowMove).to.have.been.calledWithExactly({ item: item });
    });

    it("should call `movePlaceholder` if `allowMove` is truthy", () => {
      elementFromPoint.returns(mockElementFromPoint);
      closest.returns(mockElementFromPoint);
      getItemViewModel.returns({ item: {}, ctx: { $index: 13 } });
      sortable.tryMove(100, 200);
      expect(movePlaceholder).to.have.been.calledWithExactly(13);
    });

    it("should not call `movePlaceholder` if `allowMove` is falsy", () => {
      allowMove.returns(false);
      elementFromPoint.returns(mockElementFromPoint);
      closest.returns(mockElementFromPoint);
      getItemViewModel.returns({ item: {}, ctx: { $index: 13 } });
      sortable.tryMove(100, 200);
      expect(movePlaceholder).to.have.callCount(0);
    });

  });

  describe("`getPoint`", () => {
    let boundingRect = { left: 5, top: 10, right: 75, bottom: 100 };
    let dragCenterX;
    let dragCenterY;

    beforeEach(() => {
      sortable = Object.create(sortable, {
        "axis": {
          value: "",
          writable: true
        },
        "boundingRect": {
          value: boundingRect,
          writable: true
        }
      });
      dragCenterX = sandbox.stub(sortable.drag, "getCenterX");
      dragCenterY = sandbox.stub(sortable.drag, "getCenterY");
    });

    it("should call `drag.getCenterX`", () => {
      sortable.axis = "y";
      sortable.getPoint();
      expect(dragCenterX).to.have.been.calledWithExactly();
    });

    it("should call `drag.getCenterY`", () => {
      sortable.axis = "x";
      sortable.getPoint();
      expect(dragCenterY).to.have.been.calledWithExactly();
    });

    describe("`boundingRect`", () => {

      it("should return min x", () => {
        let { x } = sortable.getPoint(1);
        expect(x).to.equal(boundingRect.left);
      });

      it("should return max x", () => {
        let { x } = sortable.getPoint(200);
        expect(x).to.equal(boundingRect.right);
      });

      it("should return min y", () => {
        let { y } = sortable.getPoint( -1, 1);
        expect(y).to.equal(boundingRect.top);
      });

      it("should return max y", () => {
        let { y } = sortable.getPoint( -1, 200);
        expect(y).to.equal(boundingRect.bottom);
      });

      it("should return valid x, y", () => {
        let { x, y } = sortable.getPoint(50, 75);
        expect(x).to.equal(50);
        expect(y).to.equal(75);
      });
    });

  });

  describe("`down`", () => {
    let allowDrag;
    let getItemViewModel;
    let event = {};
    let item = {};

    beforeEach(() => {
      allowDrag = sandbox.stub().returns(true);
      sortable = Object.create(sortable, {
        "allowDrag": {
          value: allowDrag,
          writable: true
        }
      });
      getItemViewModel = sandbox.stub(sortable, "getItemViewModel");
      getItemViewModel.returns({ item: item });
      event.preventDefault = sandbox.spy();
    });

    it("should call `allowDrag`", () => {
      getItemViewModel.returns({ item: item });
      expect(sortable.down(event, null, null)).to.be.an("undefined");
      expect(allowDrag).to.have.been.calledWithExactly({ event: event, item: item});
    });

    it("should call `preventDefault` if `allowDrag` is truthy", () => {
      sortable.down(event, null, null);
      expect(event.preventDefault).to.have.been.calledWithExactly();
    });

    it("should return falsy if `allowDrag` is falsy", () => {
      allowDrag.returns(false);
      expect(sortable.down()).to.equal(false);
    });

  });

  describe("`start`", () => {
    let element;
    let pageX;
    let pageY;
    let scroll;
    let boundingRect;
    let placeholder;
    let scrollSpeed;
    let scrollSensitivity;
    let getItemViewModel;
    let addPlaceholder;
    let item = {};
    let ctx = {};
    let dragStart;
    let autoScrollStart;

    beforeEach(() => {
      element = {};
      pageX = 10;
      pageY = 20;
      boundingRect = { left: 10, top: 20, right: 30, bottom: 40 };
      scroll = { getBoundingClientRect: sandbox.stub().returns({}) };
      placeholder = {};
      scrollSpeed = 99;
      scrollSensitivity = 66;
      sortable = Object.create(sortable, {
        "scroll": {
          value: scroll,
          writable: true
        },
        "boundingRect": {
          value: boundingRect,
          writable: true
        },
        "axis": {
          value: "foo",
          writable: true
        },
        "dragZIndex": {
          value: -1,
          writable: true
        },
        "placeholder": {
          value: placeholder,
          writable: true
        },
        "scrollSpeed": {
          value: scrollSpeed,
          writable: true
        },
        "scrollSensitivity": {
          value: scrollSensitivity,
          writable: true
        }
      });
      getItemViewModel = sandbox.stub(sortable, "getItemViewModel");
      getItemViewModel.returns({ item: item, ctx: ctx });
      dragStart = sandbox.stub(sortable.drag, "start");
      autoScrollStart = sandbox.stub(sortable.autoScroll, "start");
      addPlaceholder = sandbox.stub(sortable, "addPlaceholder");
    });

    it("should set `pageX`", () => {
      sortable.start({}, { pagePoints: [{ x: pageX, y: pageY }] }, {});
      expect(sortable.pageX).to.equal(pageX);
    });

    it("should set `pageY`", () => {
      sortable.start({}, { pagePoints: [{ x: pageX, y: pageY }] }, {});
      expect(sortable.pageY).to.equal(pageY);
    });

    it("should set `scrollRect`", () => {
      scroll.getBoundingClientRect.returns( { left: 5, top: 6, bottom: 7, right: 8, width: 9, height: 10 });
      sortable.start({}, { pagePoints: [{ x: pageX, y: pageY }] }, {});
      expect(sortable.scrollRect).to.deep.equal({ left: 5, top: 6, bottom: 7, right: 8, width: 9, height: 10 });
    });

    describe("`boundingRect`", () => {

      it("should set `boundingRect`", () => {
        sortable.start({}, { pagePoints: [{ x: pageX, y: pageY }] }, {});
        expect(sortable.boundingRect).to.equal(boundingRect);
      });

      it("should set default `boundingRect`", () => {
        sortable.boundingRect = null;
        sortable.start({}, { pagePoints: [{ x: pageX, y: pageY }] }, {});
        expect(sortable.boundingRect).to.deep.equal({
          left: sortable.scrollRect.left + 5,
          top: sortable.scrollRect.top + 5,
          right: sortable.scrollRect.right - 5,
          bottom: sortable.scrollRect.bottom - 5
        });
      });

    });

    it("should call `drag.start`", () => {
      sortable.start({}, { pagePoints: [{ x: pageX, y: pageY }] }, {});
      expect(dragStart).to.have.been.calledWithExactly(element, 10, 20, scroll, -1, placeholder, "foo");
    });

    it("should call `autoScroll.start`", () => {
      sortable.start({}, { pagePoints: [{ x: pageX, y: pageY }] }, {});
      expect(autoScrollStart).to.have.been.calledWithExactly("foo", scrollSpeed, scrollSensitivity);
    });

    it("should set `fromIx`", () => {
      getItemViewModel.returns( { ctx: { $index: 13 } });
      sortable.start({}, { pagePoints: [{ x: pageX, y: pageY }] }, {});
      expect(sortable.fromIx).to.equal(13);
    });

    it("should set `toIx`", () => {
      sortable.start({}, { pagePoints: [{ x: pageX, y: pageY }] }, {});
      expect(sortable.toIx).to.equal(-1);
    });

    it("should call `addPlaceholder`", () => {
      getItemViewModel.returns( { ctx: { $index: 13 } });
      sortable.start({}, { pagePoints: [{ x: pageX, y: pageY }] }, {});
      expect(addPlaceholder).to.have.been.calledWithExactly(13);
    });

  });

});
