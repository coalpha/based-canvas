import Listenable from "./listenable/Listenable";

import { CSSPixels, RasterUnits } from "./pixels";

interface Dimension<T extends number> {
   width: T;
   height: T;
}

export interface BasedCanvas {
   recalc(): void;

   readonly ctx: CanvasRenderingContext2D;
   readonly ctxSize: Listenable<Dimension<RasterUnits>>;

   readonly container: HTMLElement;
   readonly containerSize: Listenable<Dimension<CSSPixels>>;

   readonly canvas: HTMLCanvasElement;
   readonly canvasSize: Listenable<Dimension<CSSPixels>>;
}

