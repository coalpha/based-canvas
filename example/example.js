import PixelCanvas from "../dist/lib.js";

const canvasContainer = document.getElementById("canvas-container");
const ctx = new PixelCanvas(canvasContainer);
window.ctx = ctx;
window.PixelCanvas = PixelCanvas;

const pixelSquareColors = [
   "white", "pink", "red", "orange", "gold",
   "yellow", "lime", "green", "cyan", "blue", "violet"
];
function drawColoredPixelSquares() {
   const scale = 1;
   const styles = [0];
   let times = 5;
   while (times --> 0) {
      styles.push(...pixelSquareColors);
   }
   let lastPos = 0;
   for (let i = 1; i < styles.length; i++) {
      ctx.fillStyle = styles[i];
      const size = i * scale;
      ctx.fillRect(lastPos, lastPos, size, size);
      lastPos += size;
   }
}

function drawText() {
   ctx.ctx.font = "18px Consolas";
   ctx.ctx.fillStyle = "white";
   ctx.ctx.textBaseline = "top";
   ctx.ctx.fillText("pixel-canvas", 100, 300);
}

/** @param {CanvasRenderingContext2D} ctx */
function drawBlocks() {
   const size = ctx.integerBlock.display;
   ctx.ctx.strokeStyle = "cyan";
   const { countY, countX } = ctx.integerBlockCount;
   for (let y = 0; y < countY; y++) {
      for (let x = 0; x < countX; x++) {
         ctx.strokeRect(x * size, y * size, size, size);
      }
   }
}

function redraw() {
   drawColoredPixelSquares();
   drawText();
   if (ctx.integerBlock.display > 10) {
      drawBlocks();
   }
}

ctx.redraw = redraw;
