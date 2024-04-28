import { build } from "esbuild"
import path from "path";
import { env } from "process"
import { watch } from "chokidar";

const watcher = watch(["*.ts"])

function buildTs() {
    const esbuildOptions = {
        entryPoints: ["index.ts"],
        define: {
            __env__: `"${env.NODE_ENV}"`,
        },
        bundle: true,
        target: "firefox102",
        outfile: "index.js",

        // SCSS Plugin
        plugins: [
            // sassPlugin({
            //     async transform(source) {
            //         const { css } = await postcss([autoprefixer]).process(source);
            //         return css;
            //     },
            // }),
        ],
        // Don't turn minify on
        minify: env.NODE_ENV === "production",
    };
    build(esbuildOptions)
}
watcher.on('change', () => { buildTs() })