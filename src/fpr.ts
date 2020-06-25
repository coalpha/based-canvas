import Eq from "./Eq";
import DPRListener from "./DPR";
import { map, Listenable } from "./Listenable";
import { CSSPixels, DisplayPixels } from "./pixels";
import isPrettyMuchAnInteger from "./isPrettyMuchAnInteger";

export interface FPR {
   readonly dpx: DisplayPixels,
   readonly cpx: CSSPixels,
};

export const defaultFPR: FPR = {
   dpx: 1 as DisplayPixels,
   cpx: 1 as CSSPixels,
};

const CSS_PIXELS_LIMIT = 100;

function dpr2fpr(dpr: number) {
   for (let co = 1; co < CSS_PIXELS_LIMIT; co++) {
      if (isPrettyMuchAnInteger(dpr * co)) {
         return ({
            dpx: Math.round(dpr * co) as DisplayPixels,
            cpx: co as CSSPixels,
         });
      }
   }
   return defaultFPR;
}

const eq: Eq<FPR> = (a, b) => a.dpx === b.dpx && a.cpx === b.cpx;

export const FPRListenable: Listenable<FPR> = map(DPRListener, dpr2fpr, eq);
