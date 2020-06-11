/// <reference types="./ResizeObserver"/>

type SimpleResizeObserverFn = (entry: ResizeObserverEntry) => void;
type BoxOptions = ResizeObserverObserveOptions["box"];

export default class SimpleResizeObserver {
   #observer: ResizeObserver;
   #fn: SimpleResizeObserverFn;
   constructor(el: Element, fn: SimpleResizeObserverFn, box: BoxOptions = "content-box") {
      this.#fn = fn;
      this.#observer = new ResizeObserver(this.dispatch.bind(this));
      this.#observer.observe(el, { box });
   }

   dispatch(entries: ResizeObserverEntry[]) {
      this.#fn(entries[0]);
   }

   disconnect() {
      this.#observer.disconnect();
   }
}
