import { expect } from 'chai';
import * as sinon from 'sinon';
import { OribellaApi } from '../../src/oribella-api';
import { jsdom } from 'jsdom';
import { Longtap, register as registerLongtap } from './gestures/longtap';
import { dispatchMouseEvent } from './utils';

describe('Longtap', () => {
  let sandbox: Sinon.SinonSandbox;
  let instance: OribellaApi;
  const msPointerEnabled = false;
  const pointerEnabled = false;
  const html = `
    <html>
      <body>
        <div>
          <div></div>
          <div>
            <div class="target"></div>
          </div>
        </div>
      </body>
    </html>
  `;
  let document: Document;
  let target: Element;
  let listener: any;
  let setTimeout: Sinon.SinonStub;
  let clearTimeout: Sinon.SinonSpy;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    document = jsdom(html);
    const g = global as any;
    setTimeout = sandbox.stub().returns(1);
    clearTimeout = sandbox.spy();

    g.window = {
      ontouchstart: '',
      document,
      navigator: {
        msPointerEnabled,
        pointerEnabled
      },
      setTimeout,
      clearTimeout
    };
    instance = new OribellaApi();
    instance.registerDefaultFlowStrategy();
    registerLongtap(instance);
    instance.activate();
    listener = {
      start: sandbox.spy(),
      end: sandbox.spy(),
      cancel: sandbox.spy(),
      timeEnd: sandbox.spy()
    };

    target = document.querySelector('.target') as Element;
    if (!target) {
      throw new Error(`target not found ${html}`);
    }
  });

  afterEach(() => {
    instance.deactivate();
    sandbox.restore();
  });

  it('should call listener start', () => {
    instance.on(Longtap, target, listener);
    const evt = dispatchMouseEvent(document, target);
    expect(listener.start).to.have.been.calledWithExactly(sinon.match({
      evt,
      data: { pointers: [{ client: { x: 100, y: 100 }, page: { x: 100, y: 100 } }] },
      target
    }));
  });

  it('should call listener cancel', () => {
    instance.on(Longtap, target, listener);
    dispatchMouseEvent(document, target);
    dispatchMouseEvent(document, target, 'mousemove', 200, 200, 200, 200);
    expect(listener.cancel).to.have.been.calledWithExactly();
  });

  it('should call listener end', () => {
    instance.on(Longtap, target, listener);
    dispatchMouseEvent(document, target);
    setTimeout.callArg(0);
    expect(listener.timeEnd).to.have.been.calledWithExactly();
    const evt = dispatchMouseEvent(document, target, 'mouseup');
    expect(listener.end).to.have.been.calledWithExactly(sinon.match({
      evt,
      data: { pointers: [{ client: { x: 100, y: 100 }, page: { x: 100, y: 100 } }] },
      target
    }));
  });

});
