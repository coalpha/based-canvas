import { make } from "./Listenable";

const DPRListenable = make(
   change => window.addEventListener("resize", change),
   () => window.devicePixelRatio,
);

export default DPRListenable;
