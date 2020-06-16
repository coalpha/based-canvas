
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
const TOLERANCE = 0.001;
function isPrettyMuchAnInteger(n) {
    return Math.abs(n - (n | 0)) < TOLERANCE;
}

const CSS_PIXELS_LIMIT = 100;
/**
 * If you really want you can use this export in a pointer-like way to check
 * if getFPR returned the default.
 */
const defaultFPR = {
    dpx: 1,
    cpx: 1
};
function getFPR() {
    const dpr = window.devicePixelRatio;
    for (let co = 1; co < CSS_PIXELS_LIMIT; co++) {
        if (isPrettyMuchAnInteger(dpr * co)) {
            return {
                dpx: Math.round(dpr * co),
                cpx: co,
            };
        }
    }
    return defaultFPR;
}

let lastdpr = window.devicePixelRatio;
const fns = [];
function dispatch() {
    const dpr = window.devicePixelRatio;
    if (dpr !== lastdpr) {
        for (var i = 0; i < fns.length; i++) {
            fns[i](dpr);
        }
        lastdpr = dpr;
    }
}
window.addEventListener("resize", dispatch);
function browserZoomListener(fn) {
    fns.push(fn);
}

/// <reference types="./ResizeObserver"/>
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _observer, _fn;
class SimpleResizeObserver {
    constructor(el, fn, box = "content-box") {
        _observer.set(this, void 0);
        _fn.set(this, void 0);
        __classPrivateFieldSet(this, _fn, fn);
        __classPrivateFieldSet(this, _observer, new ResizeObserver(this.dispatch.bind(this)));
        __classPrivateFieldGet(this, _observer).observe(el, { box });
    }
    dispatch(entries) {
        __classPrivateFieldGet(this, _fn).call(this, entries[0]);
    }
    disconnect() {
        __classPrivateFieldGet(this, _observer).disconnect();
    }
}
_observer = new WeakMap(), _fn = new WeakMap();

var __classPrivateFieldSet$1 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet$1 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _containerWidth, _containerHeight, _containerResizeObserver, _container, _canvas, _ctx;
function noop() { }
class BasedCanvas {
    constructor(container, alpha = false) {
        _containerWidth.set(this, void 0);
        _containerHeight.set(this, void 0);
        _containerResizeObserver.set(this, void 0);
        this.canvasZoomed = noop;
        /** You should probably write your own paint function */
        this.canvasResized = noop;
        _container.set(this, void 0);
        _canvas.set(this, void 0);
        _ctx.set(this, void 0);
        __classPrivateFieldSet$1(this, _container, container);
        __classPrivateFieldSet$1(this, _canvas, document.createElement("canvas"));
        const ctx = __classPrivateFieldGet$1(this, _canvas).getContext("2d", { alpha });
        if (ctx == null) {
            throw new Error('HTMLElement.getContext("2d") returned null!');
        }
        __classPrivateFieldSet$1(this, _ctx, ctx); // I love flow analysis
        this.registerListeners();
        this.
            container.appendChild(__classPrivateFieldGet$1(this, _canvas));
        container.style.overflow = "hidden";
    }
    static updateFPR() {
        console.log("updateFPR");
        BasedCanvas.fpr = getFPR();
        BasedCanvas.fprListeners.forEach(listener => listener());
    }
    setCanvasSize(width, height) {
        console.group(`setCanvasSize(${width}, ${height})`);
        __classPrivateFieldGet$1(this, _canvas).style.width = `${width}px`;
        __classPrivateFieldGet$1(this, _canvas).style.height = `${height}px`;
        console.groupEnd();
    }
    setContextSize(width, height) {
        console.group(`setContextSize(${width}, ${height})`);
        // annoyingly, these get cleared when the HTMLCanvasElement is resized
        // so we can't ctx.save
        // this.#ctx.save();
        __classPrivateFieldGet$1(this, _canvas).width = width;
        __classPrivateFieldGet$1(this, _canvas).height = height;
        // this.#ctx.restore();
        console.groupEnd();
    }
    getFPRCount() {
        const { cpx } = BasedCanvas.fpr;
        return {
            x: __classPrivateFieldGet$1(this, _containerWidth) / cpx | 0,
            y: __classPrivateFieldGet$1(this, _containerHeight) / cpx | 0,
        };
    }
    browserZoomed() {
        console.group("browserZoomed");
        const { x: fprCountX, y: fprCountY } = this.getFPRCount();
        const { cpx } = BasedCanvas.fpr;
        const cpxx = (fprCountX * cpx);
        const cpxy = (fprCountY * cpx);
        this.setCanvasSize(cpxx, cpxy);
        console.info(`calling this.canvasZoomed(${cpxx}, ${cpxy})`);
        this.canvasZoomed(cpxx, cpxy);
        console.groupEnd();
    }
    containerResized(entry) {
        console.group("containerResized");
        // save the state
        const containerSize = entry.contentRect;
        console.log(`${containerSize.width}, ${containerSize.height}`);
        __classPrivateFieldSet$1(this, _containerWidth, containerSize.width);
        __classPrivateFieldSet$1(this, _containerHeight, containerSize.height);
        // do the resize
        const { x: fprCountX, y: fprCountY } = this.getFPRCount();
        const { cpx, dpx } = BasedCanvas.fpr;
        this.setCanvasSize((fprCountX * cpx), (fprCountY * cpx));
        const rpxx = (fprCountX * dpx);
        const rpxy = (fprCountY * dpx);
        this.setContextSize(rpxx, rpxy);
        console.info(`calling this.canvasResized(${rpxx}, ${rpxy})`);
        this.canvasResized(rpxx, rpxy);
        console.groupEnd();
    }
    registerListeners() {
        BasedCanvas.fprListeners.push(this.browserZoomed.bind(this));
        __classPrivateFieldSet$1(this, _containerResizeObserver, (new SimpleResizeObserver(__classPrivateFieldGet$1(this, _container), this.containerResized.bind(this))));
    }
    get container() { return __classPrivateFieldGet$1(this, _container); }
    get canvas() { return __classPrivateFieldGet$1(this, _canvas); }
    get ctx() { return __classPrivateFieldGet$1(this, _ctx); }
    get width() {
        return __classPrivateFieldGet$1(this, _canvas).width;
    }
    get height() {
        return __classPrivateFieldGet$1(this, _canvas).height;
    }
}
_containerWidth = new WeakMap(), _containerHeight = new WeakMap(), _containerResizeObserver = new WeakMap(), _container = new WeakMap(), _canvas = new WeakMap(), _ctx = new WeakMap();
/**
 * This object is not mutated.
 * Copying it into another variable will leave you with old data
 */
BasedCanvas.fpr = getFPR();
BasedCanvas.fprListeners = [];
browserZoomListener(BasedCanvas.updateFPR);

export { BasedCanvas };
//# sourceMappingURL=lib.js.map
