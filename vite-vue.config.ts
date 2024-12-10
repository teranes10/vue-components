import { getBaseConfig, getSubEntries } from './vite-base.config'

export default getBaseConfig({
  fileName: 'components',
  format: 'es',
  entry: { components: 'src/vue.ts', ...getSubEntries(import.meta.url, 'src/components/*/**/index.ts') },
  clean: true,
  dts: true,
})
