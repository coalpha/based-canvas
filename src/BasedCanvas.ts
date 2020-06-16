/// <reference types="../vendor/ResizeObserver"/>
import { CSSPixels, RasterUnits } from "./pixels";
import { getFPR } from "./fpr";

import browserZoomListener from "../vendor/BrowserZoomListener";
import SimpleResizeObserver from "../vendor/SimpleResizeObserver";

function noop() {}

type FPRCount = { x: number, y: number };

export default class BasedCanvas {
   /**
    * This object is not mutated.
    * Copying it into another variable will leave you with old data
    */
   static fpr = getFPR();
   private static fprListeners: (() => void)[] = [];
   static updateFPR() {
      console.log("updateFPR");
      BasedCanvas.fpr = getFPR();
      BasedCanvas.fprListeners.forEach(listener => listener());
   }

   private setCanvasSize(width: CSSPixels, height: CSSPixels) {
      console.group(`setCanvasSize(${width}, ${height})`);
      this.#canvas.style.width = `${width}px`;
      this.#canvas.style.height = `${height}px`;
      console.groupEnd();
   }

   private setContextSize(width: RasterUnits, height: RasterUnits) {
      console.group(`setContextSize(${width}, ${height})`);
      // annoyingly, these get cleared when the HTMLCanvasElement is resized
      // so we can't ctx.save
      // this.#ctx.save();
      this.#canvas.width = width;
      this.#canvas.height = height;
      // this.#ctx.restore();
      console.groupEnd();
   }

   private getFPRCount(): FPRCount {
      const { cpx } = BasedCanvas.fpr;
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
      const { cpx, dpx } = BasedCanvas.fpr;

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
      BasedCanvas.fprListeners.push(this.browserZoomed.bind(this));
      this.#containerResizeObserver = (
         new SimpleResizeObserver(this.#container, this.containerResized.bind(this))
      );
   }

   public canvasZoomed: (width: CSSPixels, height: CSSPixels) => void = noop;
   /** You should probably write your own paint function */
   public canvasResized: (width: RasterUnits, height: RasterUnits) => void = noop;

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
      this.#ctx = ctx; // I love flow analysis
      this.registerListeners();
      this.
      container.appendChild(this.#canvas);
      container.style.overflow = "hidden";
   }

   get container() { return this.#container }
   get canvas() { return this.#canvas }
   get ctx() { return this.#ctx }
   get width(): RasterUnits {
      return this.#canvas.width as RasterUnits;
   }
   get height(): RasterUnits {
      return this.#canvas.height as RasterUnits;
   }
}

browserZoomListener(BasedCanvas.updateFPR);
