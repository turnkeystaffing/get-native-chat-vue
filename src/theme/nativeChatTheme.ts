import type { ThemeDefinition } from 'vuetify'

type StrictThemeDefinition = ThemeDefinition & {
  colors: Record<string, string>
  variables: Record<string, string | number>
}

export const nativeChatTheme: StrictThemeDefinition = {
  dark: false,
  colors: {
    primary: '#002B38',
    secondary: '#C4105B',
    background: '#F8F8F8',
    surface: '#FFFFFF',
    error: '#DE3232',
    success: '#41A58D',
    info: '#002B38',
    'on-primary': '#FDFDFD',
    'on-secondary': '#FFFFFF',
    'on-surface': '#002B38',
  },
  variables: {},
}
