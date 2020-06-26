import Eq from "./Eq";

export interface Dimension<T extends number> {
   width: T;
   height: T;
};


export function eq<T extends number>(a: Dimension<T>, b: Dimension<T>): boolean {
   return a.width === b.width && a.height === b.height;
};
