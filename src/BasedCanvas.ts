import { Listenable } from "./Listenable";

import { CSSPixels, RasterUnits } from "./pixels";

import { Dimension } from "./Dimension";

export default interface BasedCanvas {
   recalc(): void;

   readonly ctx: CanvasRenderingContext2D;
   readonly ctxSize: Listenable<Dimension<RasterUnits>>;

   readonly container: HTMLElement;
   readonly containerSize: Listenable<Dimension<CSSPixels>>;

   readonly canvas: HTMLCanvasElement;
   readonly canvasSize: Listenable<Dimension<CSSPixels>>;
}
