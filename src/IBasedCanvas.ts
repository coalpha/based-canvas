import Runnable from "./Runnable";
import { RasterUnits, CSSPixels } from "./pixels";

export default interface IBasedCanvas {
   fetch(): void;
   recalc(): void;

   readonly ctx: CanvasRenderingContext2D;
   readonly ctxWidth: RasterUnits;
   readonly ctxHeight: RasterUnits;

   addCtxResizeListener(listener: Runnable): void;
   
   readonly canvas: HTMLCanvasElement;
   readonly canvasWidth: CSSPixels;
   readonly canvasHeight: CSSPixels;
   
   addCanvasResizeListener(listener: Runnable): void;

   readonly container: HTMLElement;
   readonly containerWidth: CSSPixels;
   readonly containerHeight: CSSPixels;

   addContainerResizeListener(listener: Runnable): void;
}

