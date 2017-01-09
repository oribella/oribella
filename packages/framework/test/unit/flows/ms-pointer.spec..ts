import {expect} from 'chai';
import {MSPointerFlow, MSPointerConfig} from '../../../src/flows/ms-pointer';

describe('MSPointerFlow', () => {
  let instance: MSPointerFlow;
  const element = {} as Element;

  beforeEach(() => {
    instance = new MSPointerFlow(element);
  });

  it('should set MSPointerConfig', () => {
    expect(instance.config).to.equal(MSPointerConfig);
  });

});
