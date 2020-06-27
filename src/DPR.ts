import Runnable from "./Runnable";

let lastdpr = window.devicePixelRatio;

const listeners: Runnable[] = [];

function updateDPR() {
   const newdpr = window.devicePixelRatio;
   if (lastdpr !== newdpr) {
      listeners.forEach(ru => ru());
   }
}

window.addEventListener("resize", updateDPR);

export default listeners.push.bind(listeners);
