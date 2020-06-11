import { RasterUnits } from "./pixels";
export default class BasedCanvas {
    #private;
    static fpr: import("./fpr").FractionalPixelRatio;
    private static fprListeners;
    static updateFPR(): void;
    private setCanvasSize;
    private setContextSize;
    private containerResized;
    prepaint(): void;
    private registerListeners;
    /** You should probably write your own paint function */
    paint: () => void;
    constructor(container: HTMLElement, alpha?: boolean);
    get container(): HTMLElement;
    get canvas(): HTMLCanvasElement;
    get ctx(): CanvasRenderingContext2D;
    get fprCountX(): number;
    get fprCountY(): number;
    get width(): RasterUnits;
    get height(): RasterUnits;
}
