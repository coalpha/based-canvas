
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var BasedCanvas = (function () {
   'use strict';

   let lastdpr = window.devicePixelRatio;
   const listeners = [];
   function updateDPR() {
       const newdpr = window.devicePixelRatio;
       if (lastdpr !== newdpr) {
           listeners.forEach(ru => ru());
       }
   }
   window.addEventListener("resize", updateDPR);
   var addDPRListener = listeners.push.bind(listeners);

   const TOLERANCE = 0.001;
   function isPrettyMuchAnInteger(n) {
       return Math.abs(n - (n | 0)) < TOLERANCE;
   }

   const listeners$1 = [];
   const addListener = listeners$1.push.bind(listeners$1);
   const currentFPR = {
       dpx: 0,
       cpx: 0,
   };
   const CSS_PIXELS_LIMIT = 100;
   function getFPR() {
       const dpr = window.devicePixelRatio;
       for (let co = 1; co < CSS_PIXELS_LIMIT; co++) {
           if (isPrettyMuchAnInteger(dpr * co)) {
               return [
                   Math.round(dpr * co),
                   co,
               ];
           }
       }
       return [
           1,
           1,
       ];
   }
   function updateFPR() {
       const [dpx, cpx] = getFPR();
       currentFPR.dpx = dpx;
       currentFPR.cpx = cpx;
       listeners$1.forEach(ru => ru());
   }
   updateFPR();
   addDPRListener(updateFPR);

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
   var _ctx, _ctxWidth, _ctxHeight, _canvas, _canvasWidth, _canvasHeight, _container, _containerWidth, _containerHeight, _fprCountX, _fprCountY, _ctxListeners, _canvasListeners, _containerListeners;
   class BasedCanvas {
       constructor(container, alpha = false) {
           _ctx.set(this, void 0);
           _ctxWidth.set(this, void 0);
           _ctxHeight.set(this, void 0);
           _canvas.set(this, void 0);
           _canvasWidth.set(this, void 0);
           _canvasHeight.set(this, void 0);
           _container.set(this, void 0);
           _containerWidth.set(this, void 0);
           _containerHeight.set(this, void 0);
           _fprCountX.set(this, void 0);
           _fprCountY.set(this, void 0);
           _ctxListeners.set(this, []);
           // it's times like this that make you want the function bind syntax
           this.addCtxResizeListener = __classPrivateFieldGet(this, _ctxListeners).push.bind(__classPrivateFieldGet(this, _ctxListeners));
           _canvasListeners.set(this, []);
           this.addCanvasResizeListener = __classPrivateFieldGet(this, _canvasListeners).push.bind(__classPrivateFieldGet(this, _canvasListeners));
           _containerListeners.set(this, []);
           this.addContainerResizeListener = __classPrivateFieldGet(this, _containerListeners).push.bind(__classPrivateFieldGet(this, _containerListeners));
           const canvas = document.createElement("canvas");
           const ctx = canvas.getContext("2d", { alpha });
           if (ctx == null) {
               throw new Error('HTMLElement.getContext("2d") returned null!');
           }
           container.appendChild(canvas);
           addListener(this.lfprChanged.bind(this));
           const RO = new ResizeObserver(this.lcontainerResized.bind(this));
           RO.observe(container);
           __classPrivateFieldSet(this, _ctx, ctx);
           __classPrivateFieldSet(this, _canvas, canvas);
           __classPrivateFieldSet(this, _container, container);
       }
       get ctx() { return __classPrivateFieldGet(this, _ctx); }
       get ctxWidth() { return __classPrivateFieldGet(this, _ctxWidth); }
       get ctxHeight() { return __classPrivateFieldGet(this, _ctxHeight); }
       get canvas() { return __classPrivateFieldGet(this, _canvas); }
       get canvasWidth() { return __classPrivateFieldGet(this, _canvasWidth); }
       get canvasHeight() { return __classPrivateFieldGet(this, _canvasHeight); }
       get container() { return __classPrivateFieldGet(this, _container); }
       get containerWidth() { return __classPrivateFieldGet(this, _containerWidth); }
       get containerHeight() { return __classPrivateFieldGet(this, _containerHeight); }
       get fprCountX() { return __classPrivateFieldGet(this, _fprCountX); }
       get fprCountY() { return __classPrivateFieldGet(this, _fprCountY); }
       lfprChanged() {
           this.recalc();
       }
       lcontainerResized([{ contentRect: { width, height } }]) {
           __classPrivateFieldSet(this, _containerWidth, width);
           __classPrivateFieldSet(this, _containerHeight, height);
           this.recalc();
           this.callContainerListeners();
       }
       fetch() {
           __classPrivateFieldSet(this, _ctxWidth, __classPrivateFieldGet(this, _canvas).width);
           __classPrivateFieldSet(this, _ctxHeight, __classPrivateFieldGet(this, _canvas).height);
           const canvasProps = window.getComputedStyle(__classPrivateFieldGet(this, _canvas));
           __classPrivateFieldSet(this, _canvasWidth, +canvasProps.width.slice(-2));
           __classPrivateFieldSet(this, _canvasHeight, +canvasProps.height.slice(-2));
           const containerProps = window.getComputedStyle(__classPrivateFieldGet(this, _container));
           __classPrivateFieldSet(this, _containerWidth, +containerProps.width.slice(-2));
           __classPrivateFieldSet(this, _containerHeight, +containerProps.height.slice(-2));
           this.recalc();
       }
       recalc() {
           const { dpx, cpx } = currentFPR;
           const fprCX = __classPrivateFieldGet(this, _containerWidth) / cpx | 0;
           const fprCY = __classPrivateFieldGet(this, _containerHeight) / cpx | 0;
           __classPrivateFieldSet(this, _fprCountX, fprCX);
           __classPrivateFieldSet(this, _fprCountY, fprCY);
           const newCtxWidth = fprCX * dpx;
           const newCtxHeight = fprCY * dpx;
           if ((newCtxWidth !== __classPrivateFieldGet(this, _ctxWidth))
               ||
                   (newCtxHeight !== __classPrivateFieldGet(this, _ctxHeight))) {
               this.setCtxSize(newCtxWidth, newCtxHeight);
               __classPrivateFieldSet(this, _ctxWidth, newCtxWidth);
               __classPrivateFieldSet(this, _ctxHeight, newCtxHeight);
           }
           const newCanvasWidth = fprCX * cpx;
           const newCanvasHeight = fprCY * cpx;
           if ((newCanvasWidth !== __classPrivateFieldGet(this, _canvasWidth))
               ||
                   (newCanvasHeight !== __classPrivateFieldGet(this, _canvasHeight))) {
               this.setCanvasSize(newCanvasWidth, newCanvasHeight);
               __classPrivateFieldSet(this, _canvasWidth, newCanvasWidth);
               __classPrivateFieldSet(this, _canvasHeight, newCanvasHeight);
           }
       }
       setCanvasSize(width, height) {
           __classPrivateFieldGet(this, _canvas).style.width = `${width}px`;
           __classPrivateFieldGet(this, _canvas).style.height = `${height}px`;
           this.callCanvasListeners();
       }
       setCtxSize(width, height) {
           __classPrivateFieldGet(this, _canvas).width = __classPrivateFieldSet(this, _ctxWidth, width);
           __classPrivateFieldGet(this, _canvas).height = __classPrivateFieldSet(this, _ctxHeight, height);
           this.callCtxListeners();
       }
       callCtxListeners() {
           __classPrivateFieldGet(this, _ctxListeners).forEach(ru => ru());
       }
       callCanvasListeners() {
           __classPrivateFieldGet(this, _canvasListeners).forEach(ru => ru());
       }
       callContainerListeners() {
           __classPrivateFieldGet(this, _containerListeners).forEach(ru => ru());
       }
   }
   _ctx = new WeakMap(), _ctxWidth = new WeakMap(), _ctxHeight = new WeakMap(), _canvas = new WeakMap(), _canvasWidth = new WeakMap(), _canvasHeight = new WeakMap(), _container = new WeakMap(), _containerWidth = new WeakMap(), _containerHeight = new WeakMap(), _fprCountX = new WeakMap(), _fprCountY = new WeakMap(), _ctxListeners = new WeakMap(), _canvasListeners = new WeakMap(), _containerListeners = new WeakMap();
   BasedCanvas.currentFPR = currentFPR;
   BasedCanvas.addFPRListener = addListener;

   return BasedCanvas;

}());
//# sourceMappingURL=lib.iife.js.map
