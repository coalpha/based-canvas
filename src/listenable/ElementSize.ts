/// <reference types="../ResizeObserver"/>

import Listenable from "./Listenable";

import { CSSPixels } from "../pixels";

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

   external([entry]: ResizeObserverEntry[]) {
      const { width, height } = entry.contentRect;
      this.#currentSize = {
         width: width as CSSPixels,
         height: height as CSSPixels,
      };
   }

   get value() { return this.#currentSize };
}
