/// <reference types="../vendor/ResizeObserver"/>
import { CSSPixels, DisplayPixels, RasterUnits } from "./pixels";
import { getFPR } from "./fpr";

import browserZoomListener from "../vendor/BrowserZoomListener";
import SimpleResizeObserver from "../vendor/SimpleResizeObserver";

export default class BasedCanvas {
   static fpr = getFPR();
   private static fprListeners: (() => void)[] = [];
   static updateFPR() {
      BasedCanvas.fpr = getFPR();
      this.fprListeners.forEach(listener => listener());
   }

   private setCanvasSize(width: CSSPixels, height: CSSPixels) {
      this.#canvas.style.width = `${width}px`;
      this.#canvas.style.height = `${height}px`;
   }

   private setContextSize(width: RasterUnits, height: RasterUnits) {
      // annoyingly, these get cleared when the HTMLCanvasElement is resized
      // so we can't ctx.save
      // this.#ctx.save();
      this.#canvas.width = width;
      this.#canvas.height = height;
      // this.#ctx.restore();
      this.paint();
   }

   
   #fprCountX!: number;
   #fprCountY!: number;
   #containerWidth!: CSSPixels;
   #containerHeight!: CSSPixels;
   private containerResized(entry: ResizeObserverEntry) {
      const containerSize = entry.contentRect; // this'll be deprecated later
      this.#containerWidth = containerSize.width as CSSPixels;
      this.#containerHeight = containerSize.height as CSSPixels;
      this.prepaint();
   }

   public prepaint() {
      const { dpx, cpx } = BasedCanvas.fpr;
      const fprCountX = this.#fprCountX = this.#containerWidth / cpx | 0;
      const fprCountY = this.#fprCountY = this.#containerHeight / cpx | 0;

      this.setCanvasSize(
         (fprCountX * cpx) as CSSPixels,
         (fprCountY * cpx) as CSSPixels,
      );
      this.setContextSize(
         (fprCountX * dpx) as RasterUnits,
         (fprCountY * dpx) as RasterUnits,
      );
   }

   #containerResizeObserver!: SimpleResizeObserver;
   private registerListeners() {
      BasedCanvas.fprListeners.push(this.prepaint.bind(this));
      this.#containerResizeObserver = (
         new SimpleResizeObserver(this.#container, this.containerResized.bind(this))
      );
   }

   /** You should probably write your own paint function */
   public paint = () => {};

   readonly #container: HTMLElement;
   readonly #canvas: HTMLCanvasElement;
   readonly #ctx: CanvasRenderingContext2D;

   constructor (container: HTMLElement, alpha = false) {
      this.#container = container;
      this.registerListeners();
      this.#canvas = document.createElement("canvas");
      const ctx = this.#canvas.getContext("2d", { alpha });
      if (ctx == null) {
         throw new Error('HTMLElement.getContext("2d") returned null!');
      }
      this.#ctx = ctx; // I love flow analysis
      container.appendChild(this.#canvas);
   }

   get container() { return this.#container }
   get canvas() { return this.#canvas }
   get ctx() { return this.#ctx }
   get fprCountX() { return this.#fprCountX|0 }
   get fprCountY() { return this.#fprCountY|0 }
   get width(): RasterUnits {
      return this.#canvas.width as RasterUnits;
   }
   get height(): RasterUnits {
      return this.#canvas.height as RasterUnits;
   }
}

browserZoomListener(BasedCanvas.updateFPR);
