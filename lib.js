function getIntegerBlock(scale) {
   const dpr = window.devicePixelRatio;
   for (let i = 1; i < 100; i++) {
      if (Number.isInteger(dpr * i)) {
         return {
            css: i,
            raster: dpr * i,
         };
      }
   }
}

class PixelCanvas {
   /**
    * @param {HTMLElement} container
    */
   constructor (container, alpha = false) {
      this.container = container;
      /** @type {HTMLCanvasElement} */
      this.canvas = document.createElement("canvas");
      this.canvas.style.imageRendering = "crisp-edges";
      this.ctx = this.canvas.getContext("2d", { alpha });
      container.appendChild(this.canvas);
      new ResizeObserver(this.containerResized.bind(this)).observe(container);
   }

   containerResized(entries) {
      // this.ctx.imageSmoothingEnabled = false;
      const containerSize = entries[0].contentBoxSize;
      const containerWidth = containerSize.inlineSize|0;
      const containerHeight = containerSize.blockSize|0;

      const integerBlock = getIntegerBlock();

      const canvasWidthBlocks = containerWidth / integerBlock.css | 0;
      const canvasHeightBlocks = containerHeight / integerBlock.css | 0;

      this.canvas.style.width = canvasWidthBlocks * integerBlock.css + "px";
      this.canvas.style.height = canvasHeightBlocks * integerBlock.css + "px";

      // raster units
      this.canvas.width = canvasWidthBlocks * integerBlock.raster;
      this.canvas.height = canvasHeightBlocks * integerBlock.raster;
      this.redraw();
   }

   static colors = ["white", "pink", "red", "orange", "gold", "yellow", "lime", "green", "cyan", "blue", "violet"]
   redraw() {
      const scale = 1;
      const styles = [0];
      let times = 5;
      while (times --> 0) {
         styles.push(...PixelCanvas.colors);
      }
      let lastPos = 0;
      for (let i = 1; i < styles.length; i++) {
         this.ctx.fillStyle = styles[i];
         const size = i * scale;
         this.ctx.fillRect(lastPos, lastPos, size, size);
         lastPos += size;
      }
   }
}
