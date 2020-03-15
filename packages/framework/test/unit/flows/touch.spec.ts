import { expect } from 'chai';
import * as sinon from 'sinon';
import { TouchFlow } from '../../../src/flows/touch';
import { Point } from '../../../src/point';
import { PointerData } from '../../../src/utils';

describe('TouchFlow', () => {
  let instance: TouchFlow;
  const element = {} as Element;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    instance = new TouchFlow(element);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set pointers', () => {
    const evt = {} as any;
    evt.touches = [{ identifier: 1, pageX: 1, pageY: 2, clientX: 3, clientY: 4 }];
    evt.changedTouches = [{ identifier: 1, pageX: 1, pageY: 2, clientX: 3, clientY: 4 }];
    instance.setPointers(evt);
    expect(instance.allPointers.get(1)).deep.equal({ page: new Point(1, 2), client: new Point(3, 4) });
    expect(instance.allPointers).to.deep.equal(instance.changedPointers);
    expect(instance.pointers.all).to.equal(instance.allPointers);
    expect(instance.pointers.changed).to.equal(instance.changedPointers);
  });

  it('should set pointer map from list', () => {
    const evt = {} as any;
    evt.touches = [{ identifier: 1, pageX: 1, pageY: 2, clientX: 3, clientY: 4 }];
    const pointers = new Map<number, PointerData>();
    instance.setPointerMapFromList(evt.touches, pointers);
    expect(pointers.get(1)).deep.equal({ page: new Point(1, 2), client: new Point(3, 4) });
  });
});
