import { CSSPixels, DisplayPixels } from "./pixels";

const CSS_PIXELS_LIMIT = 100;

export type FractionalPixelRatio = {
   readonly dpx: DisplayPixels,
   readonly cpx: CSSPixels,
}; // would be nice to have a tuple type

const defaultFPR = {
   dpx: 1 as DisplayPixels,
   cpx: 1 as CSSPixels
};

export function getFPR(): FractionalPixelRatio {
   const dpr = window.devicePixelRatio;
   for (let co = 1; co < CSS_PIXELS_LIMIT; co++) {
      if (Number.isInteger(dpr * co)) {
         return {
            dpx: dpr * co as DisplayPixels,
            cpx: co as CSSPixels,
         };
      }
   }
   return defaultFPR;
}
