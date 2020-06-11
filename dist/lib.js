
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
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

const CSS_PIXELS_LIMIT = 100;
const defaultFPR = {
    dpx: 1,
    cpx: 1
};
function getFPR() {
    const dpr = window.devicePixelRatio;
    for (let co = 1; co < CSS_PIXELS_LIMIT; co++) {
        if (Number.isInteger(dpr * co)) {
            return {
                dpx: dpr * co,
                cpx: co,
            };
        }
    }
    return defaultFPR;
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
var _fprCountX, _fprCountY, _containerWidth, _containerHeight, _containerResizeObserver, _container, _canvas, _ctx;
class BasedCanvas {
    constructor(container, alpha = false) {
        _fprCountX.set(this, void 0);
        _fprCountY.set(this, void 0);
        _containerWidth.set(this, void 0);
        _containerHeight.set(this, void 0);
        _containerResizeObserver.set(this, void 0);
        /** You should probably write your own paint function */
        this.paint = () => { };
        _container.set(this, void 0);
        _canvas.set(this, void 0);
        _ctx.set(this, void 0);
        __classPrivateFieldSet$1(this, _container, container);
        this.registerListeners();
        __classPrivateFieldSet$1(this, _canvas, document.createElement("canvas"));
        const ctx = __classPrivateFieldGet$1(this, _canvas).getContext("2d", { alpha });
        if (ctx == null) {
            throw new Error('HTMLElement.getContext("2d") returned null!');
        }
        __classPrivateFieldSet$1(this, _ctx, ctx); // I love flow analysis
        container.appendChild(__classPrivateFieldGet$1(this, _canvas));
    }
    static updateFPR() {
        BasedCanvas.fpr = getFPR();
        this.fprListeners.forEach(listener => listener());
    }
    setCanvasSize(width, height) {
        __classPrivateFieldGet$1(this, _canvas).style.width = `${width}px`;
        __classPrivateFieldGet$1(this, _canvas).style.height = `${height}px`;
    }
    setContextSize(width, height) {
        // annoyingly, these get cleared when the HTMLCanvasElement is resized
        // so we can't ctx.save
        // this.#ctx.save();
        __classPrivateFieldGet$1(this, _canvas).width = width;
        __classPrivateFieldGet$1(this, _canvas).height = height;
        // this.#ctx.restore();
        this.paint();
    }
    containerResized(entry) {
        const containerSize = entry.contentRect; // this'll be deprecated later
        __classPrivateFieldSet$1(// this'll be deprecated later
        this, _containerWidth, containerSize.width);
        __classPrivateFieldSet$1(this, _containerHeight, containerSize.height);
        this.prepaint();
    }
    prepaint() {
        const { dpx, cpx } = BasedCanvas.fpr;
        const fprCountX = __classPrivateFieldSet$1(this, _fprCountX, __classPrivateFieldGet$1(this, _containerWidth) / cpx | 0);
        const fprCountY = __classPrivateFieldSet$1(this, _fprCountY, __classPrivateFieldGet$1(this, _containerHeight) / cpx | 0);
        this.setCanvasSize((fprCountX * cpx), (fprCountY * cpx));
        this.setContextSize((fprCountX * dpx), (fprCountY * dpx));
    }
    registerListeners() {
        BasedCanvas.fprListeners.push(this.prepaint.bind(this));
        __classPrivateFieldSet$1(this, _containerResizeObserver, (new SimpleResizeObserver(__classPrivateFieldGet$1(this, _container), this.containerResized.bind(this))));
    }
    get container() { return __classPrivateFieldGet$1(this, _container); }
    get canvas() { return __classPrivateFieldGet$1(this, _canvas); }
    get ctx() { return __classPrivateFieldGet$1(this, _ctx); }
    get fprCountX() { return __classPrivateFieldGet$1(this, _fprCountX) | 0; }
    get fprCountY() { return __classPrivateFieldGet$1(this, _fprCountY) | 0; }
    get width() {
        return __classPrivateFieldGet$1(this, _canvas).width;
    }
    get height() {
        return __classPrivateFieldGet$1(this, _canvas).height;
    }
}
_fprCountX = new WeakMap(), _fprCountY = new WeakMap(), _containerWidth = new WeakMap(), _containerHeight = new WeakMap(), _containerResizeObserver = new WeakMap(), _container = new WeakMap(), _canvas = new WeakMap(), _ctx = new WeakMap();
BasedCanvas.fpr = getFPR();
BasedCanvas.fprListeners = [];
browserZoomListener(BasedCanvas.updateFPR);

export { BasedCanvas, browserZoomListener };
//# sourceMappingURL=lib.js.map
