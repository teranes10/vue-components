import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { URL, fileURLToPath } from "node:url";
import { PostcssVite, resolvePath } from "./postcss-config";
import typedCssModules from '@teranes/vite-typed-css-modules'
import dtsPlugin from 'vite-plugin-dts'
import { toKebabCase } from '@teranes/utils'
import { glob } from 'glob';
import { resolve, dirname } from "node:path";
import { readFileSync } from "node:fs";
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export type BaseConfigOptions = {
  entry: { [key: string]: string },
  subEntries?: string | boolean
  url?: string,
  fileName?: string,
  clean?: boolean,
  customElement?: boolean,
  dts?: boolean,
  format?: 'umd' | 'es',
  name?: string,
  external?: string[] | Record<string, string>
  excludeExternal?: string[],
  combineCss?: boolean,
  callback?: (info: { name: string, exports: string[] }) => void,
  append?: (chunk: any) => string
}

export function getBaseConfig({
  url = import.meta.url, fileName, entry, subEntries = 'src/components/*/**/index.ts',
  clean = false, customElement = false, dts = false,
  format = 'umd', name = '', external = [], excludeExternal = [], combineCss, callback, append }: BaseConfigOptions) {

  const depExternals = getDependencies(url).filter(x => !excludeExternal.includes(x));
  const depGlobals = getGlobals(depExternals)
  const userExternals = Array.isArray(external) ? external : Object.keys(external)
  const userGlobals = Array.isArray(external) ? {} : external
  const _external = [...depExternals, ...userExternals]
  const _globals = { ...depGlobals, ...userGlobals }

  const inspectExportsPlugin = {
    name: 'inspect-module-exports',
    moduleParsed(moduleInfo: any) {
      if (moduleInfo.isEntry) {
        moduleInfo.name = idToName(moduleInfo.id)
        callback && callback(moduleInfo)
      }
    },
  }

  return defineConfig({
    plugins: [
      vue({
        ...(customElement && {
          customElement,
          isCustomElement: (tag: any) => tag.includes('t-')
        })
      }),
      vueJsx(),
      PostcssVite({
        url,
        content: [
          "./src/**/*{vue,js,cjs,mjs,ts,jsx,tsx}"
        ],
        globalCss: [
          "./src/assets/css/_media-queries.css",
          "./src/assets/css/_mixins.css"
        ],
      }),
      typedCssModules(),
      ...(dts ? [dtsPlugin({ insertTypesEntry: true, rollupTypes: true, outDir: resolvePath(url, `dist/${format}/types`) })] : []),
      ...(combineCss ? [cssInjectedByJsPlugin()] : [])
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        plugins: [
          ...(callback ? [inspectExportsPlugin] : []),
        ],
        external: _external,
        output: {
          inlineDynamicImports: format === 'umd',
          extend: format === 'umd',
          globals: _globals,
          ...(append && { footer: append }),
          entryFileNames: (info) => {
            return format + (combineCss ? '/bundle/' : '/js/') + info.name + '.' + getExtByFormat(format)
          },
          chunkFileNames: (info) => {
            let name = info.name
            if (name.includes('.vue')) {
              name = info.name.split('.vue')[0]
            }

            return format + `/${(combineCss ? 'bundle' : 'js')}/chunks/` + toKebabCase(name) + '.' + getExtByFormat(format)
          },
          assetFileNames: (info) => {
            if (format === 'umd' && info?.name?.endsWith('.css')) {
              return format + '/css/' + `${fileName}.css`;
            }

            if (info.originalFileName?.startsWith('_')) {
              return format + '/css/' + info.originalFileName.replace('.mjs', '.css')
            }

            return format + '/css/' + '[name].[ext]';
          }
        },
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
        },
      },
      lib: {
        entry: { ...entry, ...(format === 'es' && subEntries && getSubEntries(url, subEntries as string)) },
        name: name,
        formats: [format]
      },
      cssCodeSplit: false,
      cssMinify: true,
      emptyOutDir: clean,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  });
}

function getExtByFormat(format: string) {
  if (format === 'umd') {
    return 'umd.js'
  } else if (format === 'es') {
    return 'mjs'
  }

  return 'js'
}

const GlobalNames: { [k: string]: string } = {
  'vue': 'Vue',
  '@popperjs/core': 'Popper',
  'tippy.js': 'tippy',
  'reflect-metadata': 'Reflect',
  'flatpickr': 'flatpickr',
  'toastify-js': 'Toastify',
  'zoom-vanilla.js': 'ZoomVanilla',

  '@teranes/utils': 'UTILS',
  '@teranes/popper': 'POPPER',
  "@teranes/date": "DAY",
  '@teranes/short-unique-id': "SHORT_UNIQUE_ID",
  '@teranes/vue-composables': "VUE_COMPOSABLES",
}

function getGlobals(external: string[]): { [k: string]: string } {
  const globals: any = {}

  external.forEach(e => {
    const globalName = GlobalNames[e]
    if (!globalName) {
      return console.error('Global name is not defined.', e);
    }

    globals[e] = globalName;
  })

  return globals;
}

function getDependencies(url: string) {
  const pkgJsonDir = resolvePath(url, './package.json')
  const jsonStringData = readFileSync(pkgJsonDir, 'utf8');
  const json = JSON.parse(jsonStringData)
  const dependencies = json.dependencies || {};
  return Object.keys(dependencies)
}

export function getSubEntries(url: string, path: string) {
  const entries: { [k: string]: string } = {};
  const componentFiles = glob.sync(resolvePath(url, path));

  componentFiles.forEach((file) => {
    const name = idToName(file)
    const __dirname = dirname(fileURLToPath(url));
    entries[name] = resolve(__dirname, file);
  });

  return entries;
}

function idToName(id: string) {
  const [folderName, fileName] = id.split('/').slice(-2)
  if (fileName.startsWith('index')) {
    return folderName
  }

  return fileName.split('.')[0]
}