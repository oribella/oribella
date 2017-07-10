import { expect } from 'chai';
import { MSPointerFlow, MSPointerConfig } from '../../../src/flows/ms-pointer';
import { Point } from '../../../src/point';

describe('MSPointerFlow', () => {
  let instance: MSPointerFlow;
  const element = {} as Element;

  beforeEach(() => {
    instance = new MSPointerFlow(element);
  });

  it('should set MSPointerConfig', () => {
    expect(instance.config).to.equal(MSPointerConfig);
  });

  it('should set pointers on MSPointerDown', () => {
    const evt = { type: 'MSPointerDown', pointerId: 1, pageX: 1, pageY: 2, clientX: 3, clientY: 4 } as PointerEvent;
    instance.setPointers(evt);
    expect(instance.allPointers.get(1)).deep.equal({ page: new Point(1, 2), client: new Point(3, 4) });
    expect(instance.allPointers).to.deep.equal(instance.changedPointers);
    expect(instance.pointers.all).to.equal(instance.allPointers);
    expect(instance.pointers.changed).to.equal(instance.changedPointers);
  });

  it('should set pointers on MSPointerMove', () => {
    const evt = { type: 'MSPointerMove', pointerId: 1, pageX: 5, pageY: 6, clientX: 7, clientY: 8 } as PointerEvent;
    instance.setPointers(evt);
    expect(instance.allPointers.get(1)).deep.equal({ page: new Point(5, 6), client: new Point(7, 8) });
    expect(instance.allPointers).to.deep.equal(instance.changedPointers);
    expect(instance.pointers.all).to.equal(instance.allPointers);
    expect(instance.pointers.changed).to.equal(instance.changedPointers);
  });

  it('should set pointers on MSPointerUp', () => {
    const evt = { type: 'MSPointerUp', pointerId: 1, pageX: 9, pageY: 10, clientX: 11, clientY: 12 } as PointerEvent;
    instance.setPointers(evt);
    expect(instance.allPointers.size).to.equal(0);
  });
});
