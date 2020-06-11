/// <reference types="../vendor/resizeobserver" />
declare type SimpleResizeObserverFn = (entry: ResizeObserverEntry) => void;
declare type BoxOptions = ResizeObserverObserveOptions["box"];
export default class SimpleResizeObserver {
    #private;
    constructor(el: Element, fn: SimpleResizeObserverFn, box?: BoxOptions);
    dispatch(entries: ResizeObserverEntry[]): void;
    disconnect(): void;
}
export {};
