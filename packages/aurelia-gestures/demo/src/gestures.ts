import { ListenerArgs, DefaultListenerArgs } from 'oribella-framework';
import { SwipeData } from 'oribella';

export class Gestures {
  public onTap(args: DefaultListenerArgs) {
    // tslint:disable-next-line:no-console
    console.log('tap', args);
  }
  public onDoubletap(args: DefaultListenerArgs) {
    // tslint:disable-next-line:no-console
    console.log('doubletap', args);
  }
  public onLongtap(args: DefaultListenerArgs) {
    // tslint:disable-next-line:no-console
    console.log('longtap', args);
  }
  public onSwipe(args: ListenerArgs<SwipeData>) {
    // tslint:disable-next-line:no-console
    console.log('swipe', args);
  }
  public onLongtapSwipe(args: ListenerArgs<SwipeData>) {
    // tslint:disable-next-line:no-console
    console.log('longtap swipe', args);
  }
}
