import { expect } from 'chai';
import * as sinon from 'sinon';
import { OribellaApi } from '../../src/oribella-api';
import { JSDOM } from 'jsdom';
import { registerTap } from './gestures/tap';
import { Doubletap, registerDoubletap } from './gestures/doubletap';
import { dispatchMouseEvent } from './utils';

describe('Doubletap', () => {
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
    sandbox = sinon.sandbox.create();
    document = (new JSDOM(html)).window.document;
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
    registerTap(instance);
    registerDoubletap(instance);
    instance.activate();
    listener = {
      start: sandbox.spy(),
      end: sandbox.spy(),
      cancel: sandbox.spy()
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

  it('should call listener end', () => {
    instance.on(Doubletap, target, listener);
    dispatchMouseEvent(document, target);
    dispatchMouseEvent(document, target, 'mouseup');
    dispatchMouseEvent(document, target);
    const evt = dispatchMouseEvent(document, target, 'mouseup');
    expect(listener.end.callCount).to.equal(1);
    expect(listener.end).to.have.been.calledWithExactly(sinon.match({
      evt,
      data: { pointers: [{ client: { x: 100, y: 100 }, page: { x: 100, y: 100 } }] },
      target
    }));
  });

  it('should reset after time threshold', () => {
    instance.on(Doubletap, target, listener);
    dispatchMouseEvent(document, target);
    dispatchMouseEvent(document, target, 'mouseup');
    dispatchMouseEvent(document, target);
    setTimeout.callArg(0);
    expect(listener.end).not.to.have.been.calledWithExactly();
  });

});
