import { make, Listenable } from "./Listenable";
import Eq from "./Eq";
import { FPR, FPRListenable } from "./FPR";
import makeElementSizeListenable from "./ElementSize";

interface FPRCount {
   x: number;
   y: number;
}

const eq: Eq<FPRCount> = (a, b) => a.x === b.x && a.y === b.y;

export default function makeFPRCountListenable(el: Element): Listenable<FPRCount> {
   const elementSizeListenable = makeElementSizeListenable(el);
   return make(
      change => {
         elementSizeListenable.addChangeListener(change);
         FPRListenable.addChangeListener(change);
      },

      () => {
         const cpx = FPRListenable.value.cpx;
         const { width, height } = elementSizeListenable.value;
         return ({
            x: width / cpx | 0,
            y: height / cpx | 0,
         });
      },

      eq,
   );
}
