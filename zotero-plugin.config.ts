import { defineConfig } from "zotero-plugin-scaffold";

import pkg from "./package.json"
import postCssPlugin from 'esbuild-style-plugin'

// Plugin info
let pluginInfo = pkg["zotero-react"].plugin

export default defineConfig({
    // Plugin info
    ...pluginInfo,

    // Build
    build: {
        // Manifest options
        assets: ["assets", "manifest.json"],
        makeManifest: {
            enable: true,
        },
        // assets: ["assets", "bootstrap.js"],

        // Prefs
        prefs: {
            prefixPrefKeys: true,
            prefix: `extensions.${pkg["zotero-react"].plugin.namespace}`,
            dts: "typings/prefs.d.ts"
        },

        // ESBuild
        esbuildOptions: [
            {
                // Entry points
                entryPoints: pkg["zotero-react"].entryPoints,
                bundle: true,
                target: "firefox115",
                outdir: ".scaffold/build/addon",
                format: "iife",
                treeShaking: false,
                sourcemap: true,
                globalName: pluginInfo.namespace,

                // Global variables
                define: {
                    referenceName: `"${pluginInfo.namespace}"`,
                    pluginLogPath: `"${process.env.ZOTERO_PLUGIN_LOG_PATH}"`,
                },

                // Post CSS + Tailwind
                plugins: [
                    postCssPlugin({
                        postcss: {
                            plugins: [require('@tailwindcss/postcss'), require('autoprefixer')],
                        },
                    }),
                ],
            },

            // Bootstrap
            {
                entryPoints: ["src/bootstrap.ts"],
                bundle: true,
                target: "firefox115",
                format: "cjs",
                treeShaking: false,
                sourcemap: true,
                outdir: ".scaffold/build/addon",
                define: {
                    referenceName: `"${pluginInfo.namespace}"`,
                    pluginLogPath: `"${process.env.ZOTERO_PLUGIN_LOG_PATH}"`,
                },
            },
        ],
    },

    // Dev server
    server: {
        asProxy: true,
        devtools: true,
        startArgs: [],
    },

});