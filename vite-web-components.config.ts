
import { build } from 'vite'
import { type BaseConfigOptions, getBaseConfig, getSubEntries } from './vite-base.config'
import { toPascalCase, toKebabCase } from '@teranes/utils'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const entries = getSubEntries(import.meta.url, 'src/components/*/**/index.ts')
const externals = Object.keys(entries).map(x => `@/components/${x}`).reduce((r, e) => { r[e] = 'WebComponents'; return r; }, {})
const componentExports = {}

function createExportsFile() {
    const exportsFilePath = resolve(__dirname, './src/exports.json')
    writeFileSync(exportsFilePath, JSON.stringify(componentExports))
}

function startsWithLowercase(str: string) {
    return /^[a-z]/.test(str);
}

function validateComponentExport(name: string) {
    if (startsWithLowercase(name)) {
        return false
    }

    if (['FormBuilderBase'].includes(name)) {
        return false;
    }

    return true
}

async function buildModule(name: string, filePath: string, { combineCss, append }: Partial<BaseConfigOptions> = {}) {
    const config = getBaseConfig({
        name: 'WebComponents',
        fileName: name,
        format: 'umd',
        entry: {
            [name]: filePath
        },
        customElement: true,
        combineCss,
        external: {
            '@/shared/values/colors': 'WebComponents',
            ...externals
        },
        excludeExternal: ['lucide-vue-next', 'tippy.js', 'toastify-js'],
        callback(info) {
            for (const exportName of info.exports) {
                if (validateComponentExport(exportName)) {
                    const moduleName = toPascalCase(info.name);
                    componentExports[moduleName] ??= {}
                    componentExports[moduleName][exportName] = toKebabCase(exportName)
                }
            }
        },
        append(info) {
            if (!info.isEntry) {
                return ''
            }

            const moduleName = toPascalCase(info.name);
            const exports = componentExports[moduleName] || {};

            if (!Object.keys(exports).length) {
                return ''
            }

            const registerOptionsStr = `(global.WebComponents?.registerOptions || {})`
            const registerFuncStr = Object.entries(exports).reduce((result, [exportName, componentName]) => {
                const componentStr = `global.WebComponents.${exportName}`
                const componentOptionsStr = `global.WebComponents?.componentOptions?.${exportName} || {}`
                const defineComponentStr = `global.WebComponents.defineWebComponent(${componentStr}, ${componentOptionsStr})`
                result += `global.WebComponents.registerWebComponent('${componentName}', ${defineComponentStr}, ${registerOptionsStr});`;
                return result;
            }, '')

            return `(function (global) {
                global.WebComponents ??= {}
                global.WebComponents.registry ??= {};
                global.WebComponents.registry.${moduleName} = function () { ${registerFuncStr}}

                if(${registerOptionsStr}.autoRegister !== false) {
                    global.WebComponents.registry.${moduleName}();
                }
            })(typeof globalThis !== 'undefined' ? globalThis : self);`
        },
    })

    await build(config)
}

async function buildBundle(name: string, filePath: string, options: Partial<BaseConfigOptions> = {}) {
    await buildModule(name, filePath)
    await buildModule(name, filePath, { combineCss: true })
}

//init
for (const [name, filePath] of Object.entries(entries)) {
    await buildBundle(name, filePath)
}

await buildBundle('web-components', resolve(__dirname, './src/web-components.ts'))
createExportsFile();
