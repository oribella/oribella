import {expect} from 'chai';
import {RETURN_FLAG, isMouse, isValidMouseButton, matchesSelector} from '../../src/utils';
import * as sinon from 'sinon';

describe('Utils', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should map return flag', () => {
    expect(RETURN_FLAG.map(true)).to.equal(RETURN_FLAG.REMOVE_OTHERS);
    expect(RETURN_FLAG.map(false)).to.equal(RETURN_FLAG.REMOVE);
    expect(RETURN_FLAG.map(true)).to.equal(RETURN_FLAG.REMOVE_OTHERS);
    expect(RETURN_FLAG.map(1)).to.equal(RETURN_FLAG.START_EMITTED);
    expect(RETURN_FLAG.map(2)).to.equal(RETURN_FLAG.REMOVE);
    expect(RETURN_FLAG.map(4)).to.equal(RETURN_FLAG.REMOVE_OTHERS);
    expect(RETURN_FLAG.map(-1)).to.equal(RETURN_FLAG.IDLE);
  });

  it('should detect mouse IE10', () => {
    const supports = { msPointerEnabled: true, pointerEnabled: false, touchEnabled: false };
    expect(isMouse({ pointerType: 'foo', MSPOINTER_TYPE_MOUSE: 'foo' }, supports)).to.equal(true);
  });

  it('should detect mouse IE11', () => {
    const supports = { msPointerEnabled: false, pointerEnabled: true, touchEnabled: false };
    expect(isMouse({ pointerType: 'mouse' }, supports, )).to.equal(true);
  });

  it('should detect mouse', () => {
    const supports = { msPointerEnabled: false, pointerEnabled: false, touchEnabled: false };
    expect(isMouse({ type: 'mouse' }, supports)).to.equal(true);
  });

  it('should validate mouse button', () => {
    let evt = { button: 1 };
    expect(isValidMouseButton(evt, [1])).to.equal(true);

    evt = { button: 2 };
    expect(isValidMouseButton(evt, [3])).to.equal(true);

    evt = { button: 4 };
    expect(isValidMouseButton(evt, [2])).to.equal(true);

    evt = { button: 1000 };
    expect(isValidMouseButton(evt, [0])).to.equal(true);

    const evt1 = { which: 1000 };
    expect(isValidMouseButton(evt1, [1000])).to.equal(true);

  });

  describe('Matches selector', () => {

    it('should call native matchesSelector', () => {
      const element = { matchesSelector: sandbox.spy() };
      matchesSelector(element, 'foo');
      expect(element.matchesSelector).to.have.been.calledWithExactly('foo');
    });

    it('should call native webkit matchesSelector', () => {
      const element = { webkitMatchesSelector: sandbox.spy() };
      matchesSelector(element, 'foo');
      expect(element.webkitMatchesSelector).to.have.been.calledWithExactly('foo');
    });

    it('should call native moz matchesSelector', () => {
      const element = { mozMatchesSelector: sandbox.spy() };
      matchesSelector(element, 'foo');
      expect(element.mozMatchesSelector).to.have.been.calledWithExactly('foo');
    });

    it('should call native ms matchesSelector', () => {
      const element = { msMatchesSelector: sandbox.spy() };
      matchesSelector(element, 'foo');
      expect(element.msMatchesSelector).to.have.been.calledWithExactly('foo');
    });

    it('should call native o matchesSelector', () => {
      const element = { oMatchesSelector: sandbox.spy() };
      matchesSelector(element, 'foo');
      expect(element.oMatchesSelector).to.have.been.calledWithExactly('foo');
    });

  });

});
