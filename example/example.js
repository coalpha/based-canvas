import PixelCanvas from "../dist/lib.js";

const canvasContainer = document.getElementById("canvas-container");
const ctx = new PixelCanvas(canvasContainer);
window.ctx = ctx;
window.PixelCanvas = PixelCanvas;

const rainbow = [
   "#e57373", "#f06292", "#ba68c8", "#9575cd", "#7986cb",
   "#64b5f6", "#4fc3f7", "#4dd0e1", "#4db6ac", "#81c784",
   "#aed581", "#dce775", "#fff176", "#ffd54f", "#ffb74d",
   "#ff8a65", "#a1887f", "#ADA58E", "#e0e0e0", "#ffffff",
];

function* rainbowIterator() {
   const len = rainbow.length;
   let i = 0;
   while (true) {
      if (i < len) {
         yield rainbow[i++];
      } else {
         i = 0;
      }
   }
}

function drawColoredPixelSquares() {
   let size = 1;
   let runningX = 0;
   const { width } = ctx.canvas;
   const rainbowIter = rainbowIterator();
   while (runningX < width) {
      ctx.ctx.fillStyle = rainbowIter.next().value;
      ctx.fillSquare(runningX, 0, size);
      runningX += size++;
   }
}

function drawText() {
   ctx.ctx.font = "18px Consolas";
   ctx.ctx.fillStyle = "white";
   ctx.ctx.textBaseline = "top";
   ctx.ctx.fillText("The tan line is the size of the <div>", 100, 200);
   ctx.ctx.fillText("The purple line is the size of the <canvas>", 100, 230);
   ctx.ctx.fillText("Press space to show the integerBlocks", 100, 300);
   ctx.ctx.fillText("Try zooming the browser to see if the canvas stays crisp", 100, 330);
   ctx.ctx.fillText(`There are ${ctx.integerBlock.display} display pixels for every ${ctx.integerBlock.css} pixels.`, 100, 400);
}

/** @param {CanvasRenderingContext2D} ctx */
function drawBlocks() {
   const size = ctx.integerBlock.display;
   ctx.ctx.strokeStyle = "cyan";
   const { countY, countX } = ctx.integerBlockCount;
   for (let y = 0; y < countY; y++) {
      for (let x = 0; x < countX; x++) {
         ctx.strokeSquare(x * size, y * size, size);
      }
   }
}

let doDrawBlocks = false;

function redraw() {
   drawColoredPixelSquares();
   drawText();
   if (doDrawBlocks) {
      drawBlocks();
   }
}

window.addEventListener("keypress", e => {
   if (e.keyCode === 32) {
      doDrawBlocks ^= 1;
      ctx.ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      redraw();
   }
});

ctx.redraw = redraw;
