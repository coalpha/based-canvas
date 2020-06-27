declare const _: unique symbol;

declare const __: unique symbol;

// this is how you do newtype in TypeScript
export type RasterUnits = number & { readonly [_]: unique symbol };
export type CSSPixels = number & { readonly [_]: unique symbol };

/** Can be implicitly cast to `RasterUnits` */
export type DisplayPixels = RasterUnits & { readonly [__]: unique symbol };
