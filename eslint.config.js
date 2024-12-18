import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  rules: {
    'perfectionist/sort-exports': 'off',
  },
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'type'],
      'ts/no-empty-object-type': ['off'],
    },
  },
})
