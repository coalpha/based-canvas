import { CSSPixels, DisplayPixels } from "./pixels";
import isPrettyMuchAnInteger from "./isPrettyMuchAnInteger";

const CSS_PIXELS_LIMIT = 100;

export type FractionalPixelRatio = {
   readonly dpx: DisplayPixels,
   readonly cpx: CSSPixels,
}; // would be nice to have a tuple type

/**
 * If you really want you can use this export in a pointer-like way to check
 * if getFPR returned the default.
 */
export const defaultFPR = {
   dpx: 1 as DisplayPixels,
   cpx: 1 as CSSPixels
};

export function getFPR(): FractionalPixelRatio {
   const dpr = window.devicePixelRatio;
   for (let co = 1; co < CSS_PIXELS_LIMIT; co++) {
      if (isPrettyMuchAnInteger(dpr * co)) {
         return {
            dpx: Math.round(dpr * co) as DisplayPixels,
            cpx: co as CSSPixels,
         };
      }
   }
   return defaultFPR;
}
