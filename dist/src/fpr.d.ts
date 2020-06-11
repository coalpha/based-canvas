import { CSSPixels, DisplayPixels } from "./pixels";
export declare type FractionalPixelRatio = {
    readonly dpx: DisplayPixels;
    readonly cpx: CSSPixels;
};
export declare function getFPR(): FractionalPixelRatio;
