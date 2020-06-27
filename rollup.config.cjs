const typescript = require("rollup-plugin-typescript2");
const serve = require("rollup-plugin-serve");
const livereload = require("rollup-plugin-livereload");
const { terser } = require("rollup-plugin-terser");

const config = {
   input: "src/BasedCanvas.ts",
   output: {
      file: "dist/lib.iife.js",
      format: "iife",
      name: "BasedCanvas",
      strict: true,
      sourcemap: true,
   },
   watch: "src/lib.ts",
   plugins: [typescript()],
};

if (process.env.ROLLUP_WATCH) {
   const myServer = serve({ port: 8080, contentBase: "." });
   const myLivereload = livereload({ watch: ["dist", "example"] });
   config.plugins.push(
      myServer,
      myLivereload,
   );
} else {
   config.plugins.push(terser());
}

module.exports = config;
