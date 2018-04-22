import { Router, RouterConfiguration } from 'aurelia-router';
import '../styles.css';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: ['', 'gestures'], name: 'gestures', moduleId: PLATFORM.moduleName('gestures', 'gestures'), nav: true, title: 'Gestures' },
    ]);
    this.router = router;
  }
}
