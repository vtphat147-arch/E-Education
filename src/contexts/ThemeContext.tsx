import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ColorTheme = 'indigo' | 'blue' | 'purple' | 'green' | 'pink' | 'orange' | 'teal' | 'red'
export type ModeTheme = 'light' | 'dark'

interface ThemeContextType {
  colorTheme: ColorTheme
  modeTheme: ModeTheme
  setColorTheme: (theme: ColorTheme) => void
  setModeTheme: (mode: ModeTheme) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const colorThemes: Record<ColorTheme, { primary: string; secondary: string; accent: string; gradient: string }> = {
  indigo: {
    primary: '#4F46E5',
    secondary: '#6366F1',
    accent: '#818CF8',
    gradient: 'from-indigo-600 to-purple-600'
  },
  blue: {
    primary: '#2563EB',
    secondary: '#3B82F6',
    accent: '#60A5FA',
    gradient: 'from-blue-600 to-cyan-600'
  },
  purple: {
    primary: '#9333EA',
    secondary: '#A855F7',
    accent: '#C084FC',
    gradient: 'from-purple-600 to-pink-600'
  },
  green: {
    primary: '#059669',
    secondary: '#10B981',
    accent: '#34D399',
    gradient: 'from-green-600 to-emerald-600'
  },
  pink: {
    primary: '#DB2777',
    secondary: '#EC4899',
    accent: '#F472B6',
    gradient: 'from-pink-600 to-rose-600'
  },
  orange: {
    primary: '#EA580C',
    secondary: '#F97316',
    accent: '#FB923C',
    gradient: 'from-orange-600 to-red-600'
  },
  teal: {
    primary: '#0D9488',
    secondary: '#14B8A6',
    accent: '#5EEAD4',
    gradient: 'from-teal-600 to-cyan-600'
  },
  red: {
    primary: '#DC2626',
    secondary: '#EF4444',
    accent: '#F87171',
    gradient: 'from-red-600 to-rose-600'
  }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem('colorTheme') as ColorTheme
    return saved || 'indigo'
  })

  const [modeTheme, setModeThemeState] = useState<ModeTheme>(() => {
    const saved = localStorage.getItem('modeTheme') as ModeTheme
    if (saved) return saved
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  })

  useEffect(() => {
    // Apply mode theme
    const root = document.documentElement
    if (modeTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    localStorage.setItem('modeTheme', modeTheme)
  }, [modeTheme])

  useEffect(() => {
    // Apply color theme CSS variables
    const root = document.documentElement
    const theme = colorThemes[colorTheme]
    
    root.style.setProperty('--theme-primary', theme.primary)
    root.style.setProperty('--theme-secondary', theme.secondary)
    root.style.setProperty('--theme-accent', theme.accent)
    
    // Add theme class for conditional styling
    root.classList.remove('theme-indigo', 'theme-blue', 'theme-purple', 'theme-green', 'theme-pink', 'theme-orange', 'theme-teal', 'theme-red')
    root.classList.add(`theme-${colorTheme}`)
    
    localStorage.setItem('colorTheme', colorTheme)
  }, [colorTheme])

  const toggleMode = () => {
    setModeThemeState(prev => prev === 'light' ? 'dark' : 'light')
  }

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme)
  }

  const setModeTheme = (mode: ModeTheme) => {
    setModeThemeState(mode)
  }

  return (
    <ThemeContext.Provider value={{ 
      colorTheme, 
      modeTheme, 
      setColorTheme, 
      setModeTheme, 
      toggleMode 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { colorThemes }
