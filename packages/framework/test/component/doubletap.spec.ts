import { expect } from 'chai';
import * as sinon from 'sinon';
import { OribellaApi } from '../../src/oribella-api';
import { JSDOM } from 'jsdom';
import { registerTap } from './gestures/tap';
import { Doubletap, registerDoubletap } from './gestures/doubletap';
import { dispatchMouseEvent } from './utils';
import { Point } from '../../src';

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
    sandbox = sinon.createSandbox();
    document = (new JSDOM(html, { url: 'http://localhost' })).window.document;
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
    registerTap(instance);
    registerDoubletap(instance);
    instance.activate();
    listener = {
      start: sandbox.spy(),
      end: sandbox.spy(),
      cancel: sandbox.spy(),
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
      target,
      data: { pointers: [{ page: new Point(100, 100), client: new Point(100, 100) }] },
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
