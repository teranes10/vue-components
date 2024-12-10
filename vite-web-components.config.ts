import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toKebabCase, toPascalCase } from '@teranes/utils'
import { build } from 'vite'
import { type BaseConfigOptions, getBaseConfig, getSubEntries } from './vite-base.config'

const __dirname = dirname(fileURLToPath(import.meta.url))
const entries = getSubEntries(import.meta.url, 'src/components/*/**/index.ts')
const externals = Object.keys(entries)
  .map(x => `@/components/${x}`)
  .reduce((r, e) => {
    r[e] = 'WebComponents'
    return r
  }, {})

const componentExternals = {
  '@/shared/values/colors': 'WebComponents',
  '@/shared/components/icon': 'WebComponents',
  '@/shared/vue': 'WebComponents',
  'vue': 'WebComponents.Vue',
  '@teranes/vue-composables': 'WebComponents.VueComposables',
  ...externals,
}
const excludedComponentExternals = ['tippy.js', 'toastify-js', 'zoom-vanilla.js', 'flatpickr']
const excludedComponentExports = ['FormBuilderBase', 'Vue', 'VueComposables']
const excludedComponentImports = ['vue', '@teranes/vue-composables']
const componentExports = {}
const componentImports = {}
const dependencyTree = {}

function validateComponentExport(name: string) {
  if (name === '*' || /^[a-z]/.test(name) || excludedComponentExports.includes(name)) {
    return false
  }

  return true
}

function prepareImportsReport(moduleName: string, imports: Record<string, string[]> = {}) {
  dependencyTree[moduleName] = omit(imports, excludedComponentImports)

  for (const libName in imports) {
    if (!excludedComponentImports.includes(libName)) {
      continue
    }

    componentImports[libName] ??= new Set<string>();
    (imports[libName] || []).forEach(i => componentImports[libName].add(i))
  }
}

async function buildModule(name: string, filePath: string, { combineCss, external, excludedExternal }: Partial<BaseConfigOptions> = {}) {
  const config = getBaseConfig({
    name: 'WebComponents',
    fileName: name,
    format: 'umd',
    entry: {
      [name]: filePath,
    },
    customElement: true,
    combineCss,
    external,
    excludedExternal,
    callback(info) {
      for (const exportName of info.exports) {
        if (validateComponentExport(exportName)) {
          const moduleName = toPascalCase(info.name)
          componentExports[moduleName] ??= {}
          componentExports[moduleName][exportName] = toKebabCase(exportName)
        }
      }
    },
    append(info) {
      if (!info.isEntry) {
        return ''
      }

      const moduleName = toPascalCase(info.name)
      const exports = componentExports[moduleName] || {}

      prepareImportsReport(moduleName, info.importedBindings)

      if (!Object.keys(exports).length) {
        return ''
      }

      const registerOptionsStr = `(global.WebComponents?.registerOptions || {})`
      const registerFuncStr = Object.entries(exports).reduce((result, [exportName, componentName]) => {
        const componentStr = `global.WebComponents.${exportName}`
        const componentOptionsStr = `global.WebComponents?.componentOptions?.${exportName} || {}`
        const defineComponentStr = `global.WebComponents.defineWebComponent(${componentStr}, ${componentOptionsStr})`
        result += `global.WebComponents.registerWebComponent('${componentName}', ${defineComponentStr}, ${registerOptionsStr});`
        return result
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
  await buildModule(name, filePath, options)
  await buildModule(name, filePath, { ...options, combineCss: true })
}

// start component builds
for (const [name, filePath] of Object.entries(entries)) {
  await buildBundle(name, filePath, {
    external: componentExternals,
    excludedExternal: excludedComponentExternals,
  })
}

// start shared module build to prepare shared libs
await buildBundle('web-components', resolve(__dirname, './src/web-components.ts'), {
  external: componentExternals,
  excludedExternal: excludedComponentExternals,
})

// write shared libs
const importsFileBasePath = resolve(__dirname, './src/shared/libs')
for (const lib of excludedComponentImports) {
  const importList = Array.from(componentImports[lib] || []).join(',')
  const filename = lib.split('/').at(-1)
  writeFileSync(`${importsFileBasePath}/${filename}.ts`, `export {${importList}} from '${lib}'`)
}

// start shared module build with shared libs
await buildBundle('web-components', resolve(__dirname, './src/web-components.ts'), {
  external: omit(componentExternals, excludedComponentImports),
  excludedExternal: [...excludedComponentExternals, ...excludedComponentImports],
})

// write exports
const exportsFilePath = resolve(__dirname, './dist/umd/exports.json')
writeFileSync(exportsFilePath, JSON.stringify(componentExports))

// write dependency tree
const dependencyTreeFilePath = resolve(__dirname, './dist/umd/dependency-tree.json')
writeFileSync(dependencyTreeFilePath, JSON.stringify(dependencyTree))

function omit(obj: any, keysToRemove: string[]) {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keysToRemove.includes(key)) {
      acc[key] = obj[key]
    }
    return acc
  }, {})
}
