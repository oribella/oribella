import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import * as G from './gestures';

export function configure(config: FrameworkConfiguration) {
  config.globalResources(PLATFORM.moduleName('./gestures'));
}

export { G };
