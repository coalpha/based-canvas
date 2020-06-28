const canvasContainer = document.getElementById("canvas-container");

/** @type {BasedCanvas} */
const bc = new BasedCanvas(canvasContainer);

const { ctx } = bc;
window.bc = bc;

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
      yield rainbow[i++ % len];
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

const left = 30;
const topp = 60;

function drawTextBlock(block) {
   block.split("\n").forEach((line, idx) => {
      ctx.fillText(line, left, topp + idx * 20);
   });
}

function drawText() {
   ctx.font = "18px Consolas";
   ctx.fillStyle = "white";
   ctx.textBaseline = "top";
   drawTextBlock(`
      The purple background is the <div> background.
      Go ahead and try to resize the div.
      Adjust the browser zoom to see that the image stays crisp.
      Press space to see the Fractional Pixel Ratio as a grid.

      dpr = ${window.devicePixelRatio}
      fpr = ${BasedCanvas.currentFPR.dpx}dpx / ${BasedCanvas.currentFPR.cpx}cpx
      
      ctx[${bc.ctxHeight}ru, ${bc.ctxWidth}ru]
      container[${bc.containerWidth}cpx, ${bc.containerHeight}cpx]
      canvas[${bc.canvasWidth}cpx, ${bc.canvasHeight}cpx]
   `);
}

/** @param {CanvasRenderingContext2D} ctx */
function drawBlocks() {
   const size = BasedCanvas.currentFPR.dpx;
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
      ctx.clearRect(0, 0, bc.ctxWidth, bc.ctxHeight);
      paint();
   }
});

bc.addCtxResizeListener(paint);
