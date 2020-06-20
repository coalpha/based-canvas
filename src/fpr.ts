import { CSSPixels, DisplayPixels } from "./units";
import isPrettyMuchAnInteger from "./isPrettyMuchAnInteger";
import onZoom from "../vendor/SingleBrowserZoomListener";

/**
 * this module turns the pure SingleBrowserZoomLisener into a stateful thing
 */

/** A representation of the `devicePixelRatio` as a fraction: dpx/cpx. */
type FPR = {
   readonly dpx: DisplayPixels,
   readonly cpx: CSSPixels,
};

const CSS_PIXELS_LIMIT = 100;

const defaultFPR: FPR = {
   dpx: 1 as DisplayPixels,
   cpx: 1 as CSSPixels,
};

export let current: FPR = defaultFPR;

function updateFPR(dpr = window.devicePixelRatio): void {
   for (let co = 1; co < CSS_PIXELS_LIMIT; co++) {
      if (isPrettyMuchAnInteger(dpr * co)) {
         current = {
            dpx: Math.round(dpr * co) as DisplayPixels,
            cpx: co as CSSPixels,
         };
         return;
      }
   }
   current = defaultFPR;
}

type Runnable = () => void;

const changeListeners: Runnable[] = [];

export function addChangeListener(fn: Runnable) {
   changeListeners.push(fn);
}

onZoom(dppx => {
   updateFPR(dppx);
   changeListeners.forEach(fn => fn());
});

updateFPR();
