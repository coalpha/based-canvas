
import { BasedCanvas } from "../dist/lib.js";

window.BasedCanvas = BasedCanvas;
const canvasContainer = document.getElementById("canvas-container");
const bc = new BasedCanvas(canvasContainer);
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = bc.ctx;
window.bc = bc;
window.PixelCanvas = BasedCanvas;

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
   const { width } = bc.canvas;
   const rainbowIter = rainbowIterator();
   while (runningX < width) {
      ctx.fillStyle = rainbowIter.next().value;
      ctx.fillRect(runningX, 0, size, size);
      runningX += size++;
   }
}

function drawText() {
   ctx.font = "18px Consolas";
   ctx.fillStyle = "white";
   ctx.textBaseline = "top";
   ctx.fillText("The purple background is the <div> background", 100, 230);
   ctx.fillText("Press space to show the integerBlocks", 100, 300);
   ctx.fillText("Try zooming the browser to see that the canvas stays crisp", 100, 330);
   ctx.fillText(`There are ${BasedCanvas.fpr.dpx} display pixels (dp) for every ${BasedCanvas.fpr.cpx} css pixels.`, 100, 400);
   ctx.fillText(`The container is ${bc.container.clientWidth}px by ${bc.container.clientHeight} aka ~${(bc.container.clientWidth * window.devicePixelRatio).toFixed(2)}dp by ~${(bc.container.clientHeight * window.devicePixelRatio).toFixed(2)}dp`, 100, 430);
   ctx.fillText(`The context is ${bc.canvas.width}dp by ${bc.canvas.height}dp in size`, 100, 460);
}

/** @param {CanvasRenderingContext2D} ctx */
function drawBlocks() {
   const size = BasedCanvas.fpr.dpx;
   ctx.strokeStyle = "cyan";
   const { fprCountX, fprCountY } = bc;
   for (let y = 0; y < fprCountY; y++) {
      for (let x = 0; x < fprCountX; x++) {
         ctx.strokeRect(x * size, y * size, size, size);
      }
   }
}

let doDrawBlocks = false;

function paint() {
   drawColoredPixelSquares();
   drawText();
   if (doDrawBlocks) {
      drawBlocks();
   }
}

window.addEventListener("keypress", e => {
   if (e.keyCode === 32) {
      doDrawBlocks ^= 1;
      ctx.clearRect(0, 0, bc.canvas.width, bc.canvas.height);
      paint();
   }
});

bc.canvasResized = paint;
