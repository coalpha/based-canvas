import { DisplayPixels, CSSPixels } from "./pixels";
import kindaInt from "./isPrettyMuchAnInteger";

interface FPR {
   readonly dpx: DisplayPixels,
   readonly cpx: CSSPixels,
};

const defaultFPR: FPR = {
   dpx: 1 as DisplayPixels,
   cpx: 1 as CSSPixels,
};

interface FPRListener { (fpr: FPR): void }

const listeners: FPRListener[] = [];

let lastdpr = window.devicePixelRatio;
const CSS_PIXELS_LIMIT = 100;
function resize() {
   const dpr = window.devicePixelRatio;
   if (dpr !== lastdpr) {
      lastdpr = dpr;
      for (let co = 1; co < CSS_PIXELS_LIMIT; co++) {
         if (kindaInt(dpr * co)) {
            dispatch({
               dpx: Math.round(dpr * co) as DisplayPixels,
               cpx: co as CSSPixels,
            });
         }
      }
   }
   dispatch(defaultFPR);
}

function dispatch(fpr: FPR) {
   listeners.forEach(listener => listener(fpr));
}

window.addEventListener("resize", resize);

const addListener = listeners.push.bind(listeners);

export {
   FPR,
   defaultFPR,
   FPRListener,
   addListener,
};
