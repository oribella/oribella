import { expect } from 'chai';
import * as sinon from 'sinon';
import { Oribella } from 'oribella-framework';
import { jsdom } from 'jsdom';
import { Tap, register as registerTap } from '../../src/tap';
import { dispatchMouseEvent } from './utils';

describe('Tap', () => {
  let sandbox: Sinon.SinonSandbox;
  let instance: Oribella;
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

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    document = jsdom(html);
    const g = global as any;
    g.window = {
      ontouchstart: '',
      document,
      navigator: {
        msPointerEnabled,
        pointerEnabled
      }
    };
    instance = new Oribella();
    instance.registerDefaultFlowStrategy();
    registerTap(instance);
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

  it('should call listener start', () => {
    instance.on(Tap, target, listener);
    const evt = dispatchMouseEvent(document, target);
    expect(listener.start).to.have.been.calledWithExactly(evt, sinon.match({
      pointers: [{ client: { x: 100, y: 100 }, page: { x: 100, y: 100 } }]
    }), target);
  });

  it('should call listener cancel', () => {
    instance.on(Tap, target, listener);
    dispatchMouseEvent(document, target);
    dispatchMouseEvent(document, target, 'mousemove', 200, 200, 200, 200);
    expect(listener.cancel).to.have.been.calledWithExactly();
  });

  it('should call listener end', () => {
    instance.on(Tap, target, listener);
    dispatchMouseEvent(document, target);
    const evt = dispatchMouseEvent(document, target, 'mouseup');
    expect(listener.end).to.have.been.calledWithExactly(evt, sinon.match({
      pointers: [{ client: { x: 100, y: 100 }, page: { x: 100, y: 100 } }]
    }), target);
  });

});
