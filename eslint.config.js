import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  rules: {
    'perfectionist/sort-exports': 'off',
  },
})
