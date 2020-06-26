/// <reference types="./ResizeObserver"/>
import { Listenable, make, Executor} from "./Listenable";
import { CSSPixels } from "./pixels";
import { Dimension, eq } from "./Dimension";

type CSSDimensions = Dimension<CSSPixels>;

const makeExecutor = (el: Element) => <Executor<CSSDimensions>> ((_, changeV) => {
   new ResizeObserver(([{ contentRect: { width, height }}]: ResizeObserverEntry[]) => {
      changeV({
         width: width as CSSPixels,
         height: height as CSSPixels,
      });
   }).observe(el);
});

const makeFetch = (el: Element) => (): CSSDimensions => {
   const cssprops = window.getComputedStyle(el);
   return ({
      width: +cssprops.width.slice(-2) as CSSPixels,
      height: +cssprops.height.slice(-2) as CSSPixels,
   });
};

export default function makeElementSizeListener(el: Element): Listenable<CSSDimensions> {
   return make(makeExecutor(el), makeFetch(el), eq);
}
