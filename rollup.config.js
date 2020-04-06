import typescript from "rollup-plugin-typescript2";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser"; // would have used rollup.config.j

let finalPlugin;
if (process.env.ROLLUP_WATCH) {
   finalPlugin = livereload({
      watch: ["dist", "example"],
   });
} else {
   finalPlugin = terser();
}

const config = {
   input: "src/lib.ts",
   output: {
      file: "dist/lib.js",
      format: "es",
      strict: true,
      sourcemap: true,
   },
   watch: "src/lib.ts",
   plugins: [
      typescript(),
      serve({ port: 8080, contentBase: "." }),
   ],
};

if (process.env.ROLLUP_WATCH) {
   const myLivereload = livereload({ watch: ["dist", "example"] });
   const myServer = serve({ port: 8080, contentBase: "." });
   config.plugins.push(
      myServer,
      myLivereload,
   );
} else {
   config.plugins.push(terser());
}

export default config;
