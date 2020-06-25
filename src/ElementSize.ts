/// <reference types="./ResizeObserver"/>
import { ChangeListener, Listenable, make } from "./Listenable";
import { CSSPixels } from "./pixels";
import Dimension from "./Dimension";

type CSSDimensions = Dimension<CSSPixels>;

export default class ElementSizeListenable implements Listenable<CSSDimensions> {
   #el: Element;
   #observer: ResizeObserver;
   #currentSize!: CSSDimensions;

   constructor (el: Element) {
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
         this.#listeners.forEach(listener => listener(this.#currentSize));
      }
   }

   get value() { return this.#currentSize };

   #listeners: ChangeListener<CSSDimensions>[] = [];

   addChangeListener(listener: ChangeListener<CSSDimensions>) {
      this.#listeners.push(listener);
   }
}
