import { expect } from 'chai';
import * as sinon from 'sinon';
import { OribellaApi } from '../../src/oribella-api';
import { JSDOM } from 'jsdom';
import { Longtap, registerLongtap } from './gestures/longtap';
import { dispatchMouseEvent } from './utils';

describe('Longtap', () => {
  let sandbox: sinon.SinonSandbox;
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
  let setTimeout: sinon.SinonStub;
  let clearTimeout: sinon.SinonSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    document = (new JSDOM(html)).window.document;
    const g = global as any;
    setTimeout = sandbox.stub().returns(1);
    clearTimeout = sandbox.spy();

    g.window = {
      document,
      setTimeout,
      clearTimeout,
      ontouchstart: '',

      navigator: {
        msPointerEnabled,
        pointerEnabled,
      },
    };
    instance = new OribellaApi(document);
    instance.registerDefaultFlowStrategy();
    registerLongtap(instance);
    instance.activate();
    listener = {
      start: sandbox.spy(),
      end: sandbox.spy(),
      cancel: sandbox.spy(),
      timeEnd: sandbox.spy(),
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
      target,
      data: { pointers: [{ client: { x: 100, y: 100 }, page: { x: 100, y: 100 } }] },
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
      target,
      data: { pointers: [{ client: { x: 100, y: 100 }, page: { x: 100, y: 100 } }] },
    }));
  });

});
