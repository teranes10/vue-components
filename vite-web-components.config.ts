
import { build } from 'vite'
import { getBaseConfig, getSubEntries } from './vite-base.config'

const entries = getSubEntries(import.meta.url, 'src/components/*/**/index.ts')

for (const [name, filePath] of Object.entries(entries)) {
    const config = getBaseConfig({
        name,
        fileName: name,
        format: 'umd',
        entry: {
            [name]: filePath
        },
        customElement: true,
    })

    await build(config)
}
