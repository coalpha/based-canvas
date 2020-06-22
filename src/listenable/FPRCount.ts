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
      this.#elementSize.addChangeListener(this.external.bind(this));
      FPRListenable.addChangeListener(this.external.bind(this))
   }

   protected external() {
      
   }

   fetch() {
      const cpx = FPRListenable.value.cpx;
      const { width, height } = this.#elementSize.value;
      this.#currentCount = {
         x: width / cpx | 0,
         y: height / cpx | 0,
      };
   }

   get value() { return this.#currentCount }
}
