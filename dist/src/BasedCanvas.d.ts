import { CSSPixels, RasterUnits } from "./pixels";
export default class BasedCanvas {
    #private;
    /**
     * This object is not mutated.
     * Copying it into another variable will leave you with old data
     */
    static fpr: import("./fpr").FractionalPixelRatio;
    private static fprListeners;
    static updateFPR(): void;
    private setCanvasSize;
    private setContextSize;
    private getFPRCount;
    private browserZoomed;
    private containerResized;
    private registerListeners;
    canvasZoomed: (width: CSSPixels, height: CSSPixels) => void;
    /** You should probably write your own paint function */
    canvasResized: (width: RasterUnits, height: RasterUnits) => void;
    constructor(container: HTMLElement, alpha?: boolean);
    get container(): HTMLElement;
    get canvas(): HTMLCanvasElement;
    get ctx(): CanvasRenderingContext2D;
    get width(): RasterUnits;
    get height(): RasterUnits;
}
