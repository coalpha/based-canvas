import { CSSPixels, RasterUnits } from "./units";
import { currentFPR, listen } from "./fpr";

import { BasedCanvas, BasedCanvasEventMap } from "./BasedCanvas";

import browserZoomListener from "../vendor/SingleBrowserZoomListener";
import SimpleResizeObserver from "../vendor/SimpleResizeObserver";

function noop() {}

type FPRCount = { x: number, y: number };

type Listeners = {
   [k in keyof BasedCanvasEventMap]: BasedCanvasEventMap[k][];
}

export default class BasedCanvasImpl implements BasedCanvas {
   #canvasWidth: CSSPixels;
   #canvasHeight: CSSPixels;
   private setCanvasSize(width: CSSPixels, height: CSSPixels) {
      console.group(`setCanvasSize(${width}, ${height})`);
      this.#canvasWidth = width;
      this.#canvasHeight = height;
      this.#canvas.style.width = `${width}px`;
      this.#canvas.style.height = `${height}px`;
      console.groupEnd();
   }

   #contextWidth: RasterUnits;
   #contextHeight: RasterUnits;
   private setContextSize(width: RasterUnits, height: RasterUnits) {
      console.group(`setContextSize(${width}, ${height})`);
      if (width !== this.#contextWidth || height !== this.#contextHeight) {
         console.log("Actually set it");
         this.#canvas.width = this.#contextWidth = width;
         this.#canvas.height = this.#contextHeight = height;
      }
      console.groupEnd();
   }

   private getFPRCount(): FPRCount {
      const { cpx } = currentFPR;
      return {
         x: this.#containerWidth / cpx | 0,
         y: this.#containerHeight / cpx | 0,
      };
   }

   private browserZoomed(): void {
      console.group("browserZoomed");
      const { x: fprCountX, y: fprCountY } = this.getFPRCount();
      const { cpx } = BasedCanvas.fpr;

      const cpxx = (fprCountX * cpx) as CSSPixels;
      const cpxy = (fprCountY * cpx) as CSSPixels;
      this.setCanvasSize(
         cpxx,
         cpxy,
      );
      console.info(`calling this.canvasZoomed(${cpxx}, ${cpxy})`);
      this.canvasZoomed(cpxx, cpxy);
      console.groupEnd();
   }

   recalc() {
      
   }

   #containerWidth!: CSSPixels;
   #containerHeight!: CSSPixels;
   private containerResized(entry: ResizeObserverEntry) {
      console.group("containerResized");
      // save the state
      const containerSize = entry.contentRect;
      console.log(`${containerSize.width}, ${containerSize.height}`);
      this.#containerWidth = containerSize.width as CSSPixels;
      this.#containerHeight = containerSize.height as CSSPixels;

      // do the resize
      const { x: fprCountX, y: fprCountY } = this.getFPRCount();
      const { cpx, dpx } = currentFPR;

      this.setCanvasSize(
         (fprCountX * cpx) as CSSPixels,
         (fprCountY * cpx) as CSSPixels,
         );

      const rpxx = (fprCountX * dpx) as RasterUnits;
      const rpxy = (fprCountY * dpx) as RasterUnits;
      this.setContextSize(
         rpxx,
         rpxy,
      );

      console.info(`calling this.canvasResized(${rpxx}, ${rpxy})`);
      this.canvasResized(rpxx, rpxy);
      console.groupEnd();
   }

   #containerResizeObserver!: SimpleResizeObserver;
   private registerListeners() {
      this.#containerResizeObserver = (
         new SimpleResizeObserver(this.#container, this.containerResized.bind(this))
      );
   }

   #listeners: Listeners = {
      contextResize: [],
      canvasResize: [],
   };
   
   addEventListener<K extends keyof BasedCanvasEventMap>(e: K, listener: BasedCanvasEventMap[K]): void {
      if (e === "paint") {
         this.#paintListeners.push(listener as BasedCanvasEventMap["paint"]);
      } else if (e === "zoom") {
         this.#zoomListeners.push(listener as BasedCanvasEventMap["zoom"]);
      } else {
         throw new Error(`BasedCanvasImpl#addEventListener: "${e}" is not a valid event!`);
      }
   }

   readonly #container: HTMLElement;
   readonly #canvas: HTMLCanvasElement;
   readonly #ctx: CanvasRenderingContext2D;

   constructor (container: HTMLElement, alpha = false) {
      this.#container = container;
      this.#canvas = document.createElement("canvas");
      const ctx = this.#canvas.getContext("2d", { alpha });
      if (ctx == null) {
         throw new Error('HTMLElement.getContext("2d") returned null!');
      }
      this.#ctx = ctx;
      this.registerListeners();
      container.appendChild(this.#canvas);
      container.style.overflow = "hidden";
   }

   get container() { return this.#container }
   get canvas() { return this.#canvas }
   get ctx() { return this.#ctx }
   get contextWidth(): RasterUnits {
      return this.#canvas.width as RasterUnits;
   }
   get contextHeight(): RasterUnits {
      return this.#canvas.height as RasterUnits;
   }
}
