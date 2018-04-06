import { expect } from 'chai';
import * as sinon from 'sinon';
import { Listener, DefaultListener } from '../../src/listener';
import { Options, Data, GESTURE_STRATEGY_FLAG, RETURN_FLAG } from '../../src/utils';

describe('Default listener', () => {
  let instance: DefaultListener;
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should use defaults', () => {
    instance = new Listener(new Options());
    const evt = {} as Event;
    const data = {} as Data;
    const target = {} as Element;
    expect(instance.options.pointers).to.equal(1);
    expect(instance.options.which).to.equal(1);
    expect(instance.options.prio).to.equal(100);
    expect(instance.options.strategy).to.equal(GESTURE_STRATEGY_FLAG.KEEP);
    expect(instance.down(evt, data, target)).to.equal(0);
    expect(instance.start(evt, data, target)).to.equal(RETURN_FLAG.START_EMITTED);
    expect(instance.update(evt, data, target)).to.equal(0);
    expect(instance.end(evt, data, target)).to.equal(0);
    expect(instance.cancel()).to.equal(0);
  });

  it('should mixin partial', () => {
    const evt = {} as Event;
    const data = {} as Data;
    const target = {} as Element;
    const listener = {
      selector: '',
      options: {} as Options,
      listener: {} as DefaultListener,
      down: sandbox.stub().withArgs(evt, data, target),
      start: sandbox.stub().withArgs(evt, data, target),
      update: sandbox.stub().withArgs(evt, data, target),
      end: sandbox.stub().withArgs(evt, data, target),
      cancel: sandbox.stub()
    } as DefaultListener;
    instance = new Listener({
      prio: 100,
      pointers: 10,
      which: 3,
      strategy: GESTURE_STRATEGY_FLAG.REMOVE_IF_POINTERS_GT
    }, listener);
    expect(instance.options.pointers).to.equal(10);
    expect(instance.options.which).to.equal(3);
    expect(instance.options.prio).to.equal(100);
    expect(instance.options.strategy).to.equal(GESTURE_STRATEGY_FLAG.REMOVE_IF_POINTERS_GT);
    expect(instance.down(evt, data, target)).to.equal(0);
    expect(instance.start(evt, data, target)).to.equal(1);
    expect(instance.update(evt, data, target)).to.equal(0);
    expect(instance.end(evt, data, target)).to.equal(0);
    expect(instance.cancel()).to.equal(0);
  });

});
