export type ColorKeys = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'gray'
export type ColorPlatteOptions = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'
export type Color = ColorKeys | `${ColorKeys}-${ColorPlatteOptions}` | (NonNullable<unknown> & string)

export type ColorPlatte = Record<ColorPlatteOptions | 'DEFAULT' | (NonNullable<unknown> & string), string>
export type ColorOptions = Record<ColorKeys | (NonNullable<unknown> & string), ColorPlatte>

export const colors: ColorOptions = {
  primary: {
    DEFAULT: '#4aa3c6',
    50: '#f0f9fb',
    100: '#d8eef5',
    200: '#b6deeb',
    300: '#83c4dd',
    400: '#4aa3c6',
    500: '#2e86ab',
    600: '#296d91',
    700: '#275a77',
    800: '#284b62',
    900: '#254054',
    950: '#142938',
  },
  secondary: {
    DEFAULT: '#6e6d6c',
    50: '#f6f5f5',
    100: '#e7e6e6',
    200: '#d1d0d0',
    300: '#b1b0af',
    400: '#898887',
    500: '#6e6d6c',
    600: '#5e5d5c',
    700: '#565554',
    800: '#464644',
    900: '#3d3c3c',
    950: '#262626',
  },
  success: {
    DEFAULT: '#2ba19e',
    50: '#f2fbfa',
    100: '#ccf3ee',
    200: '#a6e9e2',
    300: '#71d7d0',
    400: '#44bdb8',
    500: '#2ba19e',
    600: '#208181',
    700: '#1d6868',
    800: '#1c5153',
    900: '#1b4546',
    950: '#0a2729',
  },
  info: {
    DEFAULT: '#109fe7',
    50: '#f0f9ff',
    100: '#cee9fd',
    200: '#bbe4fc',
    300: '#7ed0fb',
    400: '#3ab7f6',
    500: '#109fe7',
    600: '#047ec5',
    700: '#0465a0',
    800: '#085684',
    900: '#0d486d',
    950: '#092d48',
  },
  warning: {
    DEFAULT: '#ec7c23',
    50: '#fef8ee',
    100: '#fce9cc',
    200: '#f9d9af',
    300: '#f5be7c',
    400: '#f09947',
    500: '#ec7c23',
    600: '#de6218',
    700: '#b84a16',
    800: '#923c1a',
    900: '#763318',
    950: '#40180a',
  },
  danger: {
    DEFAULT: '#ee4945',
    50: '#fef2f2',
    100: '#fee3e2',
    200: '#fed6d5',
    300: '#fca7a5',
    400: '#f77572',
    500: '#ee4945',
    600: '#db2b27',
    700: '#b8211d',
    800: '#981f1c',
    900: '#7f1f1d',
    950: '#450b0a',
  },
  gray: {
    DEFAULT: '#fbfbfb',
    50: '#fbfbfb',
    100: '#f2f4f8',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#768B9E',
    600: '#6c757d',
    700: '#4f5467',
    800: '#343a40',
    900: '#374550',
    950: '#343e46',
  },
}

export const componentColors = {
  primary: {
    ...colors.primary,
    color: colors.primary[400],
    text: '#fff',
  },
  secondary: {
    ...colors.secondary,
    color: colors.secondary[400],
    text: '#fff',
  },
  success: {
    ...colors.success,
    color: colors.success[400],
    text: '#fff',
  },
  info: {
    ...colors.info,
    color: colors.info[400],
    text: '#fff',
  },
  warning: {
    ...colors.warning,
    color: colors.warning[400],
    text: '#fff',
  },
  danger: {
    ...colors.danger,
    color: colors.danger[400],
    text: '#fff',
  },
  gray: {
    ...colors.gray,
    color: colors.gray[50],
    text: colors.gray[600],
  },
} as const

export type ComponentColor = keyof typeof componentColors

export function getColors(color?: string, shade?: string): any {
  if (!color) {
    return Object.keys(colors)
  }

  const variants = colors[color]
  if (!variants) {
    return undefined
  }

  if (!shade) {
    return Object.keys(variants)
  }

  return variants[shade]
}

export function getComponentColors(color?: string) {
  if (!color) {
    return Object.entries(componentColors).map(([key, value]) => ({ name: key, ...value }))
  }

  return componentColors[color as ComponentColor]
}
