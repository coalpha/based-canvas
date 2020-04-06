type IntegerBlock = {
   css: number;
   display: number;
};

type IntegerBlockCount = {
   countX: number;
   countY: number;
}

export default class PixelCanvas {
   private static integerBlockLimit = 100;
   private static getIntegerBlock(): IntegerBlock {
      const dpr = window.devicePixelRatio;
      for (let i = 1; i < PixelCanvas.integerBlockLimit; i++) {
         if (Number.isInteger(dpr * i)) {
            return {
               css: i,
               display: dpr * i,
            };
         }
      }
      return {
         css: 1|0,
         display: 1|0,
      };
   }

   #integerBlock: IntegerBlock = PixelCanvas.getIntegerBlock();

   get integerBlock() {
      return {
         css: this.#integerBlock.css|0,
         display: this.#integerBlock.display|0,
      };
   }
   readonly #integerBlockCount: IntegerBlockCount = {
      countX: 0|0,
      countY: 0|0,
   };

   get integerBlockCount() {
      return {
         countX: this.#integerBlockCount.countX|0,
         countY: this.#integerBlockCount.countY|0,
      };
   }

   private setCanvasCSSSize(width: number, height: number) {
      this.#canvas.style.width = `${width}px`;
      this.#canvas.style.height = `${height}px`;
   }

   private setContextSize(width: number, height: number) {
      // annoyingly, these get cleared when the HTMLCanvasElement is resized
      // so we can't ctx.save
      // this.#ctx.save();
      this.#canvas.width = width;
      this.#canvas.height = height;
      // this.#ctx.restore();
      this.redraw();
   }

   private containerResized(entries: ResizeObserverEntry[]) {
      const container = entries[0];
      const containerSize = container.borderBoxSize;
      const containerWidth = containerSize.inlineSize;
      const containerHeight = containerSize.blockSize;

      const { css, display } = this.integerBlock;
      const intBlockX = containerWidth / css | 0;
      const intBlockY = containerHeight / css | 0;
      this.#integerBlockCount.countX = intBlockX;
      this.#integerBlockCount.countY = intBlockY;

      this.setCanvasCSSSize(intBlockX * css, intBlockY * css);
      this.setContextSize(intBlockX * display, intBlockY * display);
   }

   private containerResizedObserver = new ResizeObserver(this.containerResized.bind(this));

   private registerListeners() {
      this.containerResizedObserver.observe(this.#container);
      window.addEventListener("resize", this.setIntegerBlock.bind(this));
   }

   private setIntegerBlock() {
      this.#integerBlock = PixelCanvas.getIntegerBlock();
   }

   /** You should probably write your own redraw function */
   public redraw = () => {};

   readonly #container: HTMLElement;
   readonly #canvas: HTMLCanvasElement;
   readonly #ctx: CanvasRenderingContext2D;
   get container() { return this.#container; }
   get canvas() { return this.#canvas; }
   get ctx() { return this.#ctx; }
   constructor (container: HTMLElement, alpha = false) {
      this.#container = container;
      this.registerListeners();
      this.#canvas = document.createElement("canvas");
      const ctx = this.#canvas.getContext("2d", { alpha });
      if (ctx == null) {
         throw new TypeError('HTMLElement.getContext("2d") returned null!');
      }
      this.#ctx = ctx; // I love flow analysis
      container.appendChild(this.#canvas);
   }

   set fillStyle(val: string) {
      this.#ctx.fillStyle = val;
   }

   public fillRectColor(x: number, y: number, width: number, height: number, color: string) {
      this.#ctx.fillStyle = color;
      this.#ctx.fillRect(x|0, y|0, width|0, height|0);
   }

   public fillRect(x: number, y: number, width: number, height: number) {
      this.#ctx.fillRect(x|0, y|0, width|0, height|0);
   }

   public fillSquare(x: number, y: number, sideLength: number) {
      this.#ctx.fillRect(x|0, y|0, sideLength|0, sideLength|0);
   }

   public strokeSquare(x: number, y: number, sideLength: number) {
      this.#ctx.strokeRect(x|0, y|0, sideLength|0, sideLength|0);
   }

   public fillSquareColor(x: number, y: number, sideLength: number, color: string) {
      this.#ctx.fillStyle = color;
      this.#ctx.fillRect(x|0, y|0, sideLength|0, sideLength|0);
   }
}
