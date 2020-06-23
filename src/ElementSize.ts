/// <reference types="./ResizeObserver"/>

import Listenable from "./Listenable";

import { CSSPixels } from "./pixels";

interface Dimensions {
   width: CSSPixels;
   height: CSSPixels;
};

export default class ElementSizeListenable extends Listenable<Dimensions> {
   #el: Element;
   #observer: ResizeObserver;
   #currentSize!: Dimensions;

   constructor (el: Element) {
      super();
      this.#el = el;
      this.#observer = new ResizeObserver(this.external.bind(this));
      this.#observer.observe(el);
      this.fetch();
   }

   fetch() {
      const cssprops = window.getComputedStyle(this.#el);
      this.#currentSize = {
         width: +cssprops.width.slice(-2) as CSSPixels,
         height: +cssprops.height.slice(-2) as CSSPixels,
      };
   }

   external([{ contentRect: { width, height }}]: ResizeObserverEntry[]) {
      if (this.#currentSize.width !== width || this.#currentSize.height !== height) {
         this.#currentSize = {
            width: width as CSSPixels,
            height: height as CSSPixels,
         };
         super.callListeners();
      }
   }

   get value() { return this.#currentSize };
}
