declare const _: unique symbol;

// this is how you do newtype in TypeScript
export type DisplayPixels = number & { readonly [_]: unique symbol };
export type RasterUnits = number & { readonly [_]: unique symbol };
export type CSSPixels = number & { readonly [_]: unique symbol };
