import { Point } from './point';

export const GESTURE_STRATEGY_FLAG = {
  KEEP: 0,
  REMOVE_IF_POINTERS_GT: 1
};

export const RETURN_FLAG = {
  map(result: number | boolean): number {
    switch (result) {
      case true:
        result = this.REMOVE_OTHERS;
        break;
      case false:
        result = this.REMOVE;
        break;
      case 1:
      case 2:
      case 4:
        break;
      default:
        result = 0;
    }

    return result as number;
  },
  IDLE: 0,
  START_EMITTED: 1,
  REMOVE: 2,
  REMOVE_OTHERS: 4,
  REMOVE_AND_CONTINUE: 8,
  COMPOSE: 16
};

export function isMouse(supports: Supports, evt: any) {
  if (supports.msPointerEnabled && evt.pointerType === evt.MSPOINTER_TYPE_MOUSE) { // IE10
    return true;
  }
  if (supports.pointerEnabled && evt.pointerType === 'mouse') { // E11
    return true;
  }
  return evt.type.indexOf('mouse') !== -1;
}

export function isValidMouseButton(
  { button, which }: { button?: number | undefined, which?: number | undefined }, allowedBtn: number[] | number) {
  const actualBtn = (!which && button !== undefined) ?
    (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0))) :
    which;
  return Array.isArray(allowedBtn) ? allowedBtn.some((val) => {
    return actualBtn === val;
  }) : actualBtn === allowedBtn;
}

export function matchesSelector(element: any, selector: string) {
  return (element.matchesSelector ||
    element.webkitMatchesSelector ||
    element.mozMatchesSelector ||
    element.msMatchesSelector ||
    element.oMatchesSelector
  ).call(element, selector);
}

export interface PointerData {
  page: Point;
  client: Point;
};
export class PointerDataMap extends Map<number, PointerData> {};
export interface Pointers {
  all: PointerDataMap;
  changed: PointerDataMap;
};

export interface Supports {
  msPointerEnabled: boolean;
  pointerEnabled: boolean;
  touchEnabled: boolean;
}

export class Options {
  public pointers: number = 1;
  public which: number = 1;
  public prio: number = 100;
  public strategy: number = GESTURE_STRATEGY_FLAG.KEEP;
}

export class Data {
  public pointers: PointerData[];
}
