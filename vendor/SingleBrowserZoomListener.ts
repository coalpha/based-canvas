type NumberConsumer = (dpr: number) => void;
let lastdpr = window.devicePixelRatio;
let fn: NumberConsumer = _ => {};

function dispatch() {
   const dpr = window.devicePixelRatio;
   if (dpr !== lastdpr) {
      fn(dpr);
      lastdpr = dpr;
   }
}

window.addEventListener("resize", dispatch);

export default function browserZoomListener(ifn: NumberConsumer): void {
   fn = ifn;
}
