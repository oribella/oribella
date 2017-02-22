import { ListenerArgs, DefaultListenerArgs } from 'oribella-framework';
import { SwipeData } from 'oribella';

export class Gestures {
  public onTap(args: DefaultListenerArgs) {
    console.log('tap', args);
  }
  public onDoubletap(args: DefaultListenerArgs) {
    console.log('doubletap', args);
  }
  public onLongtap(args: DefaultListenerArgs) {
    console.log('longtap', args);
  }
  public onSwipe(args: ListenerArgs<SwipeData>) {
    console.log('swipe', args);
  }
  public onLongtapSwipe(args: ListenerArgs<SwipeData>) {
    console.log('longtap swipe', args);
  }
}
