import { CSSPixels, DisplayPixels } from "./units";
import isPrettyMuchAnInteger from "./isPrettyMuchAnInteger";
import onZoom from "../vendor/SingleBrowserZoomListener";

/** A representation of the `devicePixelRatio` as a fraction: dpx/cpx. */
type FPR = {
   readonly dpx: DisplayPixels,
   readonly cpx: CSSPixels,
};

const CSS_PIXELS_LIMIT = 100;

const defaultFPR = {
   dpx: 1 as DisplayPixels,
   cpx: 1 as CSSPixels,
};

export let currentFPR = defaultFPR;

function updateFPR(dpr = window.devicePixelRatio): void {
   for (let co = 1; co < CSS_PIXELS_LIMIT; co++) {
      if (isPrettyMuchAnInteger(dpr * co)) {
         currentFPR = {
            dpx: Math.round(dpr * co) as DisplayPixels,
            cpx: co as CSSPixels,
         };
         return;
      }
   }
   currentFPR = defaultFPR;
}

type FPRConsumer = (fpr: FPR | null) => void;

const listeners: FPRConsumer[] = [];

export function listen(fn: FPRConsumer) {
   listeners.push(fn);
}

onZoom(dppx => {
   updateFPR(dppx);
   listeners.forEach(fn => fn(currentFPR));
});
