import { expect } from 'chai';
import * as sinon from 'sinon';
import { MouseFlow } from '../../../src/flows/mouse';
import { Point } from '../../../src/point';

describe('MouseFlow', () => {
  let instance: MouseFlow;
  const element = {} as Element;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    instance = new MouseFlow(element);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set config', () => {
    expect(instance.config.start.getEvents()).to.deep.equal(['mousedown']);
    expect(instance.config.update.getEvents()).to.deep.equal(['mousemove']);
    expect(instance.config.end.getEvents()).to.deep.equal(['mouseup']);
    expect(instance.config.cancel.getEvents()).to.deep.equal(['dragstart']);
  });

  it('should set pointers on mousedown', () => {
    const evt = { type: 'mousedown', pageX: 1, pageY: 2, clientX: 3, clientY: 4 } as MouseEvent;
    instance.setPointers(evt);
    expect(instance.allPointers.get(1)).deep.equal({ page: new Point(1, 2), client: new Point(3, 4) });
    expect(instance.allPointers).to.deep.equal(instance.changedPointers);
    expect(instance.pointers.all).to.equal(instance.allPointers);
    expect(instance.pointers.changed).to.equal(instance.changedPointers);
  });

  it('should set pointers on mousemove', () => {
    const evt = { type: 'mousemove', pageX: 5, pageY: 6, clientX: 7, clientY: 8 } as MouseEvent;
    instance.setPointers(evt);
    expect(instance.allPointers.get(1)).deep.equal({ page: new Point(5, 6), client: new Point(7, 8) });
    expect(instance.allPointers).to.deep.equal(instance.changedPointers);
    expect(instance.pointers.all).to.equal(instance.allPointers);
    expect(instance.pointers.changed).to.equal(instance.changedPointers);
  });

  it('should set pointers on mouseup', () => {
    const evt = { type: 'mouseup', pageX: 9, pageY: 10, clientX: 11, clientY: 12 } as MouseEvent;
    instance.setPointers(evt);
    expect(instance.allPointers.size).to.equal(0);
  });

});
