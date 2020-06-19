import { CSSPixels, RasterUnits } from "./units";

type PaintFunction = (width: RasterUnits, height: RasterUnits) => void;
type WindowZoomFunction = (width: CSSPixels, height: CSSPixels) => void;

export interface BasedCanvasEventMap {
   "contextResize": PaintFunction;
   "canvasResize": WindowZoomFunction;
}

export interface BasedCanvas {
   addEventListener<K extends keyof BasedCanvasEventMap>(e: K, listener: BasedCanvasEventMap[K]): void;
   /**
    * This is probably O(n) where n is the number of listeners.
    * You probably don't want to call this a bunch
    */
   removeEventListener<K extends keyof BasedCanvasEventMap>(e: K, listener: BasedCanvasEventMap[K]): boolean;
   recalc(): void;

   readonly container: HTMLElement;
   readonly canvas: HTMLCanvasElement;
   readonly ctx: CanvasRenderingContext2D;
   readonly containerWidth: CSSPixels;
   readonly containerHeight: CSSPixels;
   readonly contextWidth: RasterUnits;
   readonly contextHeight: RasterUnits;
}

