import { useTheme, ColorTheme } from '../contexts/ThemeContext'

// Map color themes to Tailwind classes
const themeClasses: Record<ColorTheme, {
  primary: string
  secondary: string
  accent: string
  gradient: string
  hover: string
  text: string
  bg: string
}> = {
  indigo: {
    primary: 'indigo-600',
    secondary: 'indigo-700',
    accent: 'indigo-400',
    gradient: 'from-indigo-600 to-purple-600',
    hover: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-600'
  },
  blue: {
    primary: 'blue-600',
    secondary: 'blue-700',
    accent: 'blue-400',
    gradient: 'from-blue-600 to-cyan-600',
    hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-600'
  },
  purple: {
    primary: 'purple-600',
    secondary: 'purple-700',
    accent: 'purple-400',
    gradient: 'from-purple-600 to-pink-600',
    hover: 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-600'
  },
  green: {
    primary: 'green-600',
    secondary: 'green-700',
    accent: 'green-400',
    gradient: 'from-green-600 to-emerald-600',
    hover: 'hover:bg-green-50 dark:hover:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-600'
  },
  pink: {
    primary: 'pink-600',
    secondary: 'pink-700',
    accent: 'pink-400',
    gradient: 'from-pink-600 to-rose-600',
    hover: 'hover:bg-pink-50 dark:hover:bg-pink-900/20',
    text: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-600'
  },
  orange: {
    primary: 'orange-600',
    secondary: 'orange-700',
    accent: 'orange-400',
    gradient: 'from-orange-600 to-red-600',
    hover: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-600'
  },
  teal: {
    primary: 'teal-600',
    secondary: 'teal-700',
    accent: 'teal-400',
    gradient: 'from-teal-600 to-cyan-600',
    hover: 'hover:bg-teal-50 dark:hover:bg-teal-900/20',
    text: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-600'
  },
  red: {
    primary: 'red-600',
    secondary: 'red-700',
    accent: 'red-400',
    gradient: 'from-red-600 to-rose-600',
    hover: 'hover:bg-red-50 dark:hover:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-600'
  }
}

export const useThemeClasses = () => {
  const { colorTheme } = useTheme()
  return themeClasses[colorTheme]
}

