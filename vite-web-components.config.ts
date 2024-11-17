
import { build } from 'vite'
import { getBaseConfig, getSubEntries } from './vite-base.config'
import { toPascalCase, toKebabCase } from '@teranes/utils'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
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

async function buildModule(name: string, filePath: string) {
    const config = getBaseConfig({
        name: 'WebComponents',
        fileName: name,
        format: 'umd',
        entry: {
            [name]: filePath
        },
        customElement: true,
        external: ['@/shared/values/colors'],
        excludeExternal: ['lucide-vue-next'],
        callback(info) {
            for (const exportName of info.exports) {
                if (validateComponentExport(exportName)) {
                    const moduleName = toPascalCase(info.name);
                    componentExports[moduleName] ??= {
                        exports: {},
                        js: `umd/js/${info.name}.umd.js`,
                        css: `umd/css/${info.name}.css`
                    }

                    componentExports[moduleName]['exports'][exportName] = toKebabCase(exportName)
                }
            }
        }
    })

    await build(config)
}

const entries = getSubEntries(import.meta.url, 'src/components/*/**/index.ts')
for (const [name, filePath] of Object.entries(entries)) {
    await buildModule(name, filePath)
}

createExportsFile();
buildModule('web-components', resolve(__dirname, './src/web-components.ts'))
