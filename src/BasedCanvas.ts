import Runnable from "./Runnable";
import IBasedCanvas from "./IBasedCanvas";
import { RasterUnits, DisplayPixels, CSSPixels } from "./pixels";
import { currentFPR, addListener } from "./FPR";

interface BasedCanvasOptions extends CanvasRenderingContext2DSettings{
   overflow: boolean;
}

const defaultBasedCanvasOptions = { alpha: false } as BasedCanvasOptions;

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

   readonly #fprOverflow: boolean;
   #fprCountX!: number;
   #fprCountY!: number;
   get fprCountX() { return this.#fprCountX }
   get fprCountY() { return this.#fprCountY }

   constructor (container: HTMLElement, maybeOptions?: BasedCanvasOptions) {
      const options = Object.assign(defaultBasedCanvasOptions, maybeOptions);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", options);
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
      this.#fprOverflow = !!options.overflow;
      this.fetch();
   }

   private lfprChanged() {
      this.recalc();
   };

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
   }

   recalc() {
      const { dpx, cpx } = currentFPR;

      const toInt = this.#fprOverflow ? Math.ceil : Math.floor;

      const fprCX = toInt(this.#containerWidth / cpx);
      const fprCY = toInt(this.#containerHeight / cpx);
      this.#fprCountX = fprCX;
      this.#fprCountY  = fprCY;

      const newCtxWidth = fprCX * dpx as DisplayPixels;
      const newCtxHeight = fprCY * dpx as DisplayPixels;

      const ctxSizeChanged = (
         (newCtxWidth !== this.#ctxWidth)
         ||
         (newCtxHeight !== this.#ctxHeight)
      );

      const newCanvasWidth = fprCX * cpx as CSSPixels;
      const newCanvasHeight = fprCY * cpx as CSSPixels;

      const canvasSizeChanged = (
         (newCanvasWidth !== this.#canvasWidth)
         ||
         (newCanvasHeight !== this.#canvasHeight)
      );

      if (ctxSizeChanged) {
         this.#canvas.width = newCtxWidth;
         this.#canvas.height = newCtxHeight;
         this.#ctxWidth = newCtxWidth;
         this.#ctxHeight = newCtxHeight;
      }

      if (canvasSizeChanged) {
         this.#canvas.style.width = `${newCanvasWidth}px`;
         this.#canvas.style.height = `${newCanvasHeight}px`;
         this.#canvasWidth = newCanvasWidth;
         this.#canvasHeight = newCanvasHeight;
      }

      if (ctxSizeChanged) {
         this.callCtxListeners();
      }

      if (canvasSizeChanged) {
         this.callCanvasListeners();
      }
   }

   #ctxListeners: Runnable[] = [];
   // it's times like this that make you want the function bind syntax
   addCtxResizeListener = this.#ctxListeners.push.bind(this.#ctxListeners);
   #callCtxListenersNextFrame = false;
   private callCtxListeners() {
      if (this.#callCtxListenersNextFrame === false) {
         window.requestAnimationFrame(this.actuallyCallCtxListeners.bind(this));
         this.#callCanvasListenersNextFrame = true;
      }
   }

   private actuallyCallCtxListeners() {
      this.#ctxListeners.forEach(ru => ru());
      this.#callCtxListenersNextFrame === false;
   }

   #canvasListeners: Runnable[] = [];
   addCanvasResizeListener = this.#canvasListeners.push.bind(this.#canvasListeners);
   #callCanvasListenersNextFrame = false;
   private callCanvasListeners() {
      if (this.#callCanvasListenersNextFrame === false) {
         window.requestAnimationFrame(this.actuallyCallCanvasListeners.bind(this));
         this.#callCanvasListenersNextFrame = true;
      }
   }

   private actuallyCallCanvasListeners() {
      this.#canvasListeners.forEach(ru => ru());
      this.#callCanvasListenersNextFrame = false;
   }

   #containerListeners: Runnable[] = [];
   addContainerResizeListener = this.#containerListeners.push.bind(this.#containerListeners);
   private callContainerListeners() {
      this.#containerListeners.forEach(ru => ru());
   }
}
