import { make, Listenable } from "./Listenable";

var dpr = window.devicePixelRatio;

const DPRListener: Listenable<number> = make(change => {
   window.addEventListener("resize", change);
});

new class DPRListener extends Listenable<typeof dpr> {
   constructor () {
      super();
      window.addEventListener("resize", this.external.bind(this));
   };

   protected external() {
      const newDPR = window.devicePixelRatio;
      if (dpr !== newDPR) {
         dpr = newDPR;
         super.callListeners();
      }
   };

   fetch() { dpr = window.devicePixelRatio };

   /**
    * @name devicePixelRatio
    * @name dpr
    * @name dppx
    * @see dpx / cpx
    * @see dppx / cppx
    */
   get value() { return dpr };
}

export default DPRListener;
