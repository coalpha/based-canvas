import { CSSPixels, DisplayPixels } from "./pixels";
export declare type FractionalPixelRatio = {
    readonly dpx: DisplayPixels;
    readonly cpx: CSSPixels;
};
/**
 * If you really want you can use this export in a pointer-like way to check
 * if getFPR returned the default.
 */
export declare const defaultFPR: {
    dpx: DisplayPixels;
    cpx: CSSPixels;
};
export declare function getFPR(): FractionalPixelRatio;
