import Listenable from "./Listenable";

import FPRListenable from "./FPR";
import ElementSizeListenable from "./ElementSize";

interface FPRCount {
   x: number;
   y: number;
}

export default class FPRCountListenable extends Listenable<FPRCount> {
   #elementSize: ElementSizeListenable;
   #currentCount!: FPRCount;

   constructor (el: Element) {
      super();
      this.#elementSize = new ElementSizeListenable(el);
      this.#elementSize.addChangeListener(super.external.bind(this));
      FPRListenable.addChangeListener(super.external.bind(this))
   };

   fetch() {
      const cpx = FPRListenable.value.cpx;
      const { width, height } = this.#elementSize.value;
      const newFPRCount = {
         x: width / cpx | 0,
         y: height / cpx | 0,
      };

      if (newFPRCount.x !== this.#currentCount.x || newFPRCount.y !== this.#currentCount.y) {
         super.callListeners();
      }
   };

   get value() { return this.#currentCount };
}
