import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Check, ChevronDown } from 'lucide-react'
import { useTheme, ColorTheme } from '../contexts/ThemeContext'
import { useThemeClasses } from '../hooks/useThemeClasses'

const ThemeSelector = () => {
  const { colorTheme, modeTheme, setColorTheme, toggleMode } = useTheme()
  const themeClasses = useThemeClasses()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const themes: { name: string; value: ColorTheme; primaryColor: string }[] = [
    { name: 'Indigo', value: 'indigo', primaryColor: '#4F46E5' },
    { name: 'Blue', value: 'blue', primaryColor: '#2563EB' },
    { name: 'Purple', value: 'purple', primaryColor: '#9333EA' },
    { name: 'Green', value: 'green', primaryColor: '#059669' },
    { name: 'Pink', value: 'pink', primaryColor: '#DB2777' },
    { name: 'Orange', value: 'orange', primaryColor: '#EA580C' },
    { name: 'Teal', value: 'teal', primaryColor: '#0D9488' },
    { name: 'Red', value: 'red', primaryColor: '#DC2626' },
  ]

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        left: rect.left,
        top: rect.bottom + 8
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        buttonRef.current && 
        !buttonRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    const handleScroll = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setDropdownPosition({
          left: rect.left,
          top: rect.bottom + 8
        })
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleScroll)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={containerRef}>
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
          isOpen
            ? `${themeClasses.bg} text-white shadow-lg`
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
        }`}
        title="Theme Selector"
      >
        <Palette className="w-5 h-5" />
        <span className="hidden md:inline">Theme</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && typeof window !== 'undefined' && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            left: `${dropdownPosition.left}px`,
            top: `${dropdownPosition.top}px`,
            zIndex: 10000,
            pointerEvents: 'auto'
          }}
          className="w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mode Toggle */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
              <motion.button
                onClick={toggleMode}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  modeTheme === 'dark' ? themeClasses.bg : 'bg-gray-300'
                }`}
              >
                <motion.div
                  animate={{ x: modeTheme === 'dark' ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
              </motion.button>
            </div>
          </div>

          {/* Color Themes */}
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
              Color Themes
            </div>
            {themes.map((theme) => (
              <motion.button
                key={theme.value}
                onClick={() => {
                  setColorTheme(theme.value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  colorTheme === theme.value
                    ? `${themeClasses.hover} ${themeClasses.text} bg-opacity-50 dark:bg-opacity-30`
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <span>{theme.name}</span>
                </div>
                {colorTheme === theme.value && (
                  <Check className="w-5 h-5" />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ThemeSelector


