import type { Plugin } from 'postcss'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcssVariables from '@teranes/postcss-variables'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import postcssCustomMedia from 'postcss-custom-media'
import postcssImport from 'postcss-import'
import tailwindcssNesting from 'tailwindcss/nesting/index.js'
import tailwindPlugin from 'tailwindcss/plugin.js'
import { type ColorOptions, getColors, getComponentColors } from './src/shared/values/colors'

type PostcssViteOptions = PostcssPluginOptions & {
  url?: string
}

export function PostcssVite({
  url,
  content,
  colors,
  plugins,
  tailwindPlugins,
  globalCss,
}: PostcssViteOptions = {}) {
  if (!url) {
    throw new Error('Url is required!')
  }

  const _plugins = postcssPlugins({
    content: content?.map(x => resolvePath(url, x)),
    globalCss: globalCss?.map(x => resolvePath(url, x)),
    colors,
    tailwindPlugins,
    plugins,
  })

  return {
    name: 'vue-components',
    config(config: any) {
      config.css ??= {}
      config.css.postcss = { plugins: _plugins }
    },
  }
}

interface PostcssPluginOptions {
  prefix?: string
  content?: string[]
  colors?: Partial<ColorOptions>
  plugins?: any
  tailwindPlugins?: any
  globalCss?: string[]
}

function postcssPlugins({ prefix = '', plugins = [], globalCss = [] }: PostcssPluginOptions = {}): Plugin[] {
  // const _colors = { ...defaultColors, ...(colors && colors as any) }
  // const _tailwindPlugins = [...(tailwindPlugins ? tailwindPlugins : [])]

  // // const _tailwindcss = tailwindcss({
  // //     content: content,
  // //     theme: {
  // //         extend: { colors: _colors },
  // //     },
  // //     plugins: _tailwindPlugins,
  // // })

  return [
    postcssGlobalCss(globalCss),
    postcssImport,
    postcssCustomMedia,
    postcssVariables({ variables: { prefix }, functions: { getItem, getColors, getComponentColors } }),
    ...(plugins || []),
    tailwindcssNesting,
    autoprefixer,
    cssnano,
  ]
}

function getItem(value: any | any[], index: string) {
  if (!value || !index) {
    return ''
  }

  return JSON.parse(value)[index]
}

function postcssGlobalCss(files: string[]): Plugin {
  return {
    postcssPlugin: 'postcss-global-css',
    Once(root) {
      for (const file of files) {
        root.prepend(`@import '${file}';`)
      }
    },
  }
}

export function generateCssVariablesPlugin(colors: ColorOptions) {
  return tailwindPlugin(({ addUtilities }) => {
    const colorVariables: Record<string, string> = {}

    for (const colorName of Object.keys(colors)) {
      const color = colors[colorName]

      if (typeof color === 'string') {
        colorVariables[`--color-${colorName}`] = color
      }

      if (typeof color === 'object') {
        for (const shadeName of Object.keys(color)) {
          const variableName = shadeName === 'DEFAULT' ? `--color-${colorName}` : `--color-${colorName}-${shadeName}`
          const colorShade = color[shadeName]
          if (colorShade) {
            colorVariables[variableName] = colorShade
          }
        }
      }
    }

    addUtilities({ ':root': colorVariables })
  })
}

export function resolvePath(url: string, filePath: string) {
  const __filename = fileURLToPath(url)
  const __dirname = dirname(__filename)

  return join(__dirname, filePath)
}
