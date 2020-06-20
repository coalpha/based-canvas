import { CSSPixels, RasterUnits } from "./units";
import * as FPR from "./fpr";

import { BasedCanvas, EventMap as EventMap, EventKey y } from "./BasedCanvas";

import SimpleResizeObserver from "../vendor/SimpleResizeObserver";

type FPRCount = { x: number, y: number };

type Listeners = {
   [k in keyof EventMap]: Set<EventMap[k]>;
}

export default class BasedCanvasImpl implements BasedCanvas {
   readonly #ctx: CanvasRenderingContext2D;
   #ctxWidth!: RasterUnits;
   #ctxHeight!: RasterUnits;

   readonly #canvas: HTMLCanvasElement;
   #canvasWidth!: CSSPixels;
   #canvasHeight!: CSSPixels;

   readonly #container: HTMLElement;
   #containerWidth!: CSSPixels;
   #containerHeight!: CSSPixels;

   readonly #containerResizeObserver: SimpleResizeObserver;
   constructor (container: HTMLElement, alpha = false) {
      container: {
         this.#container = container;
         container.style.overflow = "hidden";
      }

      canvas: {
         this.#canvas = document.createElement("canvas");
         const ctx = this.#canvas.getContext("2d", { alpha });
         if (ctx == null) {
            throw new Error('HTMLElement.getContext("2d") returned null!');
         }
         this.#ctx = ctx;
         container.appendChild(this.#canvas);
      }
      listeners: {
         this.#containerResizeObserver = (
            new SimpleResizeObserver(this.#container, this.containerResized.bind(this))
         );

         FPR.addChangeListener(() => {
            
         });
      }
      this.updateState();
   }

   private updateState() {
      this.#ctxWidth = this.#canvas.width as RasterUnits;
      this.#ctxHeight = this.#canvas.height as RasterUnits;

      const canvasProps = window.getComputedStyle(this.#canvas);
      this.#canvasWidth = +canvasProps.width.slice(-2) as CSSPixels;
      this.#canvasHeight = +canvasProps.height.slice(-2) as CSSPixels;

      const containerProps = window.getComputedStyle(this.#container);
      this.#containerWidth = +containerProps.width.slice(-2) as CSSPixels;
      this.#containerHeight = +containerProps.height.slice(-2) as CSSPixels;
   }

   private setCanvasSize(width: CSSPixels, height: CSSPixels) {
      console.group(`setCanvasSize(${width}, ${height})`);
      if (width !== this.#canvasWidth || height !== this.#canvasHeight) {
         console.log("Actually set it");
         this.#canvasWidth = width;
         this.#canvasHeight = height;
         this.#canvas.style.width = `${width}px`;
         this.#canvas.style.height = `${height}px`;
      }
      console.groupEnd();
   }

   private setContextSize(width: RasterUnits, height: RasterUnits) {
      console.group(`setContextSize(${width}, ${height})`);
      if (width !== this.#ctxWidth || height !== this.#ctxHeight) {
         console.log("Actually set it");
         this.#canvas.width = this.#ctxWidth = width;
         this.#canvas.height = this.#ctxHeight = height;
      }
      console.groupEnd();
   }

   private getFPRCount(): FPRCount {
      const { cpx } = current;
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

   private containerResized(entry: ResizeObserverEntry) {
      console.group("containerResized");
      // save the state
      const containerSize = entry.contentRect;
      console.log(`${containerSize.width}, ${containerSize.height}`);
      this.#containerWidth = containerSize.width as CSSPixels;
      this.#containerHeight = containerSize.height as CSSPixels;

      // do the resize
      const { x: fprCountX, y: fprCountY } = this.getFPRCount();
      const { cpx, dpx } = current;

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

   #listeners: Listeners = {
      contextResize: new Set,
      canvasResize: new Set,
   };

   #eventNames = Object.keys(this.#listeners);

   addEventListener<K extends EventKey>(k: EventKey, listener: EventMap[K]): void {
      if (this.#eventNames.includes(k)) {
         // I really tried to get this to work cleanly without the `any`.
         // I blame the type system
         this.#listeners[k].add(listener as any);
      } else {
         throw new Error(`BasedCanvasImpl#addEventListener: "${k}" is not a valid event!`);
      }
   }

   dispatchEvent<K extends EventKey>(k: K, ...args: Parameters<EventMap[K]>): void {
      if (this.#eventNames.includes(k)) {
         this.#listeners[k].forEach((fn: any) => fn(...args));
      } else {
         throw new Error(`BasedCanvasImpl#dispatchEvent: "${k}" is not a valid event!`);
      }
   }

   /** @returns `true` if the function was actually removed */
   removeEventListener<K extends EventKey>(k: EventKey, listener: EventMap[K]): boolean {
      if (this.#eventNames.includes(k)) {
         return this.#listeners[k].delete(listener as any);
      }
      return false;
   }

   // getters
   get ctx() { return this.#ctx }
   get ctxWidth() { return this.#ctxWidth }
   get ctxHeight() { return this.#ctxHeight }

   get canvas() { return this.#canvas }
   get canvasWidth() { return this.#canvasWidth }
   get canvasHeight() { return this.#canvasHeight }

   get container() { return this.#container }
   get containerWidth() { return this.#containerWidth }
   get containerHeight() { return this.#containerHeight }
}
