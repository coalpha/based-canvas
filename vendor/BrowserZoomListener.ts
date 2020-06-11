type NumberConsumer = (dpr: number) => void;
let lastdpr = window.devicePixelRatio;
const fns: NumberConsumer[] = [];

function dispatch() {
   const dpr = window.devicePixelRatio;
   if (dpr !== lastdpr) {
      for (var i = 0; i < fns.length; i++) {
         fns[i](dpr);
      }
      lastdpr = dpr;
   }
}

window.addEventListener("resize", dispatch);

export default function browserZoomListener(fn: NumberConsumer): void {
   fns.push(fn);
}
