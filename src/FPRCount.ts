import { Listenable } from "./Listenable";
import { FPR, FPRListenable } from "./FPR";
import ElementSizeListenable from "./ElementSize";

interface FPRCount {
   x: number;
   y: number;
}

export default class FPRCountListenable implements Listenable<FPRCount> {
   #elementSize: ElementSizeListenable;
   #currentCount!: FPRCount;

   constructor (el: Element) {
      this.#elementSize = new ElementSizeListenable(el);
      this.#elementSize.addChangeListener(this.external.bind(this));
      FPRListenable.addChangeListener(this.external.bind(this))
   };

   external() {
      
   }

   addChangeListener()

   fetch() {
      const cpx = FPRListenable.value.cpx;
      const { width, height } = this.#elementSize.value;
      const newFPRCount = {
         x: width / cpx | 0,
         y: height / cpx | 0,
      };

      if (newFPRCount.x !== this.#currentCount.x || newFPRCount.y !== this.#currentCount.y) {
         
      }
   };

   get value() { return this.#currentCount };
}
