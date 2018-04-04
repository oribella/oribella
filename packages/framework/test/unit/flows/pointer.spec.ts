import { expect } from 'chai';
import * as sinon from 'sinon';
import { PointerFlow } from '../../../src/flows/pointer';
import { Point } from '../../../src/point';

describe('PointerFlow', () => {
  let instance: PointerFlow;
  const element = {} as Element;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    instance = new PointerFlow(element);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set pointers on pointerdown', () => {
    const evt = { type: 'pointerdown', pointerId: 1, pageX: 1, pageY: 2, clientX: 3, clientY: 4 } as PointerEvent;
    instance.setPointers(evt);
    expect(instance.allPointers.get(1)).deep.equal({ page: new Point(1, 2), client: new Point(3, 4) });
    expect(instance.allPointers).to.deep.equal(instance.changedPointers);
    expect(instance.pointers.all).to.equal(instance.allPointers);
    expect(instance.pointers.changed).to.equal(instance.changedPointers);
  });

  it('should set pointers on pointermove', () => {
    const evt = { type: 'pointermove', pointerId: 1, pageX: 5, pageY: 6, clientX: 7, clientY: 8 } as PointerEvent;
    instance.setPointers(evt);
    expect(instance.allPointers.get(1)).deep.equal({ page: new Point(5, 6), client: new Point(7, 8) });
    expect(instance.allPointers).to.deep.equal(instance.changedPointers);
    expect(instance.pointers.all).to.equal(instance.allPointers);
    expect(instance.pointers.changed).to.equal(instance.changedPointers);
  });

  it('should set pointers on pointerup', () => {
    const evt = { type: 'pointerup', pointerId: 1, pageX: 9, pageY: 10, clientX: 11, clientY: 12 } as PointerEvent;
    instance.setPointers(evt);
    expect(instance.allPointers.size).to.equal(0);
  });

});
