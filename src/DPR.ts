import { make } from "./Listenable";

const DPRListener = make(
   change => window.addEventListener("resize", change),
   () => window.devicePixelRatio,
);

export default DPRListener;
