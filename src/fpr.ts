import Runnable from "./Runnable";
import addDPRListener from "./DPR";
import kindaInt from "./isPrettyMuchAnInteger";
import { DisplayPixels, CSSPixels } from "./pixels";

const listeners: Runnable[] = [];

export const addListener = listeners.push.bind(listeners);

export const currentFPR = {
   dpx: 0 as DisplayPixels,
   cpx: 0 as CSSPixels,
};

const CSS_PIXELS_LIMIT = 100;

function getFPR(): [DisplayPixels, CSSPixels] {
   const dpr = window.devicePixelRatio;
   for (let co = 1; co < CSS_PIXELS_LIMIT; co++) {
      if (kindaInt(dpr * co)) {
         return [
            Math.round(dpr * co) as DisplayPixels,
            co as CSSPixels,
         ];
      }
   }
   return [
      1 as DisplayPixels,
      1 as CSSPixels,
   ];
}

function updateFPR() {
   const [dpx, cpx] = getFPR();
   currentFPR.dpx = dpx;
   currentFPR.cpx = cpx;
   listeners.forEach(ru => ru());
}

updateFPR();

addDPRListener(updateFPR);
