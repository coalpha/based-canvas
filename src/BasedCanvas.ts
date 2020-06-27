import Runnable from "./Runnable";
import IBasedCanvas from "./IBasedCanvas";
import { RasterUnits, DisplayPixels, CSSPixels } from "./pixels";
import { currentFPR, addListener } from "./FPR";

export default class BasedCanvas implements IBasedCanvas {
   static currentFPR = currentFPR;
   static addFPRListener = addListener;

   readonly #ctx: CanvasRenderingContext2D;
   #ctxWidth!: RasterUnits;
   #ctxHeight!: RasterUnits;
   get ctx() { return this.#ctx }
   get ctxWidth() { return this.#ctxWidth }
   get ctxHeight() { return this.#ctxHeight }

   readonly #canvas: HTMLCanvasElement;
   #canvasWidth!: CSSPixels;
   #canvasHeight!: CSSPixels;
   get canvas() { return this.#canvas }
   get canvasWidth() { return this.#canvasWidth }
   get canvasHeight() { return this.#canvasHeight }

   readonly #container: HTMLElement;
   #containerWidth!: CSSPixels;
   #containerHeight!: CSSPixels;
   get container() { return this.#container }
   get containerWidth() { return this.#containerWidth }
   get containerHeight() { return this.#containerHeight }

   #fprCountX!: number;
   #fprCountY!: number;
   get fprCountX() { return this.#fprCountX }
   get fprCountY() { return this.#fprCountY }

   constructor (container: HTMLElement, alpha = false) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha });
      if (ctx == null) {
         throw new Error('HTMLElement.getContext("2d") returned null!');
      }
      container.appendChild(canvas);

      addListener(this.lfprChanged.bind(this));

      const RO = new ResizeObserver(this.lcontainerResized.bind(this));
      RO.observe(container);

      this.#ctx = ctx;
      this.#canvas = canvas;
      this.#container = container;
   }

   private lfprChanged() {
      this.recalc();
   }

   private lcontainerResized([{contentRect: { width, height }}]: ResizeObserverEntry[]) {
      this.#containerWidth = width as CSSPixels;
      this.#containerHeight = height as CSSPixels;
      this.recalc();
      this.callContainerListeners()
   }

   fetch() {
      this.#ctxWidth = this.#canvas.width as RasterUnits;
      this.#ctxHeight = this.#canvas.height as RasterUnits;

      const canvasProps = window.getComputedStyle(this.#canvas);
      this.#canvasWidth = +canvasProps.width.slice(-2) as CSSPixels;
      this.#canvasHeight = +canvasProps.height.slice(-2) as CSSPixels;

      const containerProps = window.getComputedStyle(this.#container);
      this.#containerWidth = +containerProps.width.slice(-2) as CSSPixels;
      this.#containerHeight = +containerProps.height.slice(-2) as CSSPixels;

      this.recalc();
   }

   recalc() {
      const { dpx, cpx } = currentFPR;

      const fprCX = this.#containerWidth / cpx | 0;
      const fprCY = this.#containerHeight / cpx | 0;
      this.#fprCountX = fprCX;
      this.#fprCountY  = fprCY;

      const newCtxWidth = fprCX * dpx as DisplayPixels;
      const newCtxHeight = fprCY * dpx as DisplayPixels;

      if (
         (newCtxWidth !== this.#ctxWidth)
         ||
         (newCtxHeight !== this.#ctxHeight)
      ) {
         this.setCtxSize(newCtxWidth, newCtxHeight);
         this.#ctxWidth = newCtxWidth;
         this.#ctxHeight = newCtxHeight;
      }

      const newCanvasWidth = fprCX * cpx as CSSPixels;
      const newCanvasHeight = fprCY * cpx as CSSPixels;

      if (
         (newCanvasWidth !== this.#canvasWidth)
         ||
         (newCanvasHeight !== this.#canvasHeight)
      ) {
         this.setCanvasSize(newCanvasWidth, newCanvasHeight);
         this.#canvasWidth = newCanvasWidth;
         this.#canvasHeight = newCanvasHeight;
      }
   }

   private setCanvasSize(width: CSSPixels, height: CSSPixels) {
      this.#canvas.style.width = `${width}px`;
      this.#canvas.style.height = `${height}px`;
      this.callCanvasListeners();
   }

   private setCtxSize(width: RasterUnits, height: RasterUnits) {
      this.#canvas.width = this.#ctxWidth = width;
      this.#canvas.height = this.#ctxHeight = height;
      this.callCtxListeners();
   }

   #ctxListeners: Runnable[] = [];
   // it's times like this that make you want the function bind syntax
   addCtxResizeListener = this.#ctxListeners.push.bind(this.#ctxListeners);
   private callCtxListeners() {
      this.#ctxListeners.forEach(ru => ru());
   }

   #canvasListeners: Runnable[] = [];
   addCanvasResizeListener = this.#canvasListeners.push.bind(this.#canvasListeners);
   private callCanvasListeners() {
      this.#canvasListeners.forEach(ru => ru());
   }

   #containerListeners: Runnable[] = [];
   addContainerResizeListener = this.#containerListeners.push.bind(this.#containerListeners);
   private callContainerListeners() {
      this.#containerListeners.forEach(ru => ru());
   }
}
