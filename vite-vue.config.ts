
import { getBaseConfig } from './vite-base.config'

export default getBaseConfig({
  fileName: "components",
  format: 'es',
  entry: { 'components': 'src/vue.ts' },
  clean: true,
  dts: true,
})