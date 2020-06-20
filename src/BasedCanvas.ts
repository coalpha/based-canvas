import { CSSPixels, RasterUnits } from "./units";

type PaintFunction = (width: RasterUnits, height: RasterUnits) => void;
type WindowZoomFunction = (width: CSSPixels, height: CSSPixels) => void;

export interface EventMap {
   "contextResize": PaintFunction;
   "canvasResize": WindowZoomFunction;
}

export type EventKey = keyof EventMap;

export type EventFnParams<K extends EventKey> = Parameters<EventMap[K]>;

export interface BasedCanvas /* extends EventTarget */ {
   addEventListener<K extends EventKey>(k: EventKey, listener: EventMap[K]): void;
   // private dispatchEvent<K extends EventKey>(k: EventKey, ...args: EventFnParams<K>): void;
   /**
    * This is probably O(n) where n is the number of listeners.
    * You probably don't want to call this a bunch
    */
   removeEventListener<K extends EventKey>(k: EventKey, listener: EventMap[K]): boolean;
   recalc(): void;

   readonly ctx: CanvasRenderingContext2D;
   readonly ctxWidth: RasterUnits;
   readonly ctxHeight: RasterUnits;

   readonly container: HTMLElement;
   readonly containerWidth: CSSPixels;
   readonly containerHeight: CSSPixels;

   readonly canvas: HTMLCanvasElement;
   readonly canvasWidth: CSSPixels;
   readonly canvasHeight: CSSPixels;
}

