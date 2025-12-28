import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, Code, FileCode, Archive, Copy, Check, ChevronDown } from 'lucide-react'
import { DesignComponent } from '../services/api'

interface ExportDropdownProps {
  component: DesignComponent
}

const ExportDropdown = ({ component }: ExportDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        left: rect.left,
        top: rect.bottom + 8
      })
    }
  }, [isOpen])

  // Handle click outside and update position on scroll/resize
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (buttonRef.current && !buttonRef.current.contains(target)) {
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

    const handleResize = () => {
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
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen])

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  const downloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${component.name}</title>
    <style>
${component.cssCode}
    </style>
</head>
<body>
${component.htmlCode}
${component.jsCode ? `    <script>
${component.jsCode}
    </script>` : ''}
</body>
</html>`
    downloadFile(htmlContent, `${component.name.replace(/\s+/g, '-').toLowerCase()}.html`, 'text/html')
  }

  const downloadCSS = () => {
    downloadFile(component.cssCode, `${component.name.replace(/\s+/g, '-').toLowerCase()}.css`, 'text/css')
  }

  const downloadJS = () => {
    if (!component.jsCode) return
    downloadFile(component.jsCode, `${component.name.replace(/\s+/g, '-').toLowerCase()}.js`, 'text/javascript')
  }

  const downloadZIP = async () => {
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${component.name}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
${component.htmlCode}
${component.jsCode ? '<script src="script.js"></script>' : ''}
</body>
</html>`
      zip.file('index.html', htmlContent)
      zip.file('styles.css', component.cssCode)
      if (component.jsCode) {
        zip.file('script.js', component.jsCode)
      }

      const readme = `# ${component.name}

${component.description}

## Category
${component.category}

## Type
${component.type}

${component.framework ? `## Framework\n${component.framework}\n` : ''}
${component.tags ? `## Tags\n${component.tags}\n` : ''}

## Usage
1. Extract all files
2. Open \`index.html\` in your browser

## Files
- \`index.html\` - Main HTML file
- \`styles.css\` - Stylesheet
${component.jsCode ? '- `script.js` - JavaScript file' : ''}
`
      zip.file('README.md', readme)

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${component.name.replace(/\s+/g, '-').toLowerCase()}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setIsOpen(false)
    } catch (error) {
      console.error('Error creating ZIP:', error)
      alert('Error creating ZIP file. Please try downloading individual files.')
    }
  }

  const copyAllCode = async () => {
    const allCode = `<!-- ${component.name} -->
<!-- ${component.description} -->

<!-- HTML -->
${component.htmlCode}

<!-- CSS -->
<style>
${component.cssCode}
</style>

<!-- JavaScript -->
${component.jsCode ? `<script>
${component.jsCode}
</script>` : ''}`
    
    await navigator.clipboard.writeText(allCode)
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
    setIsOpen(false)
  }

  const exportOptions = [
    {
      name: 'Download HTML',
      icon: FileText,
      onClick: downloadHTML,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Download CSS',
      icon: Code,
      onClick: downloadCSS,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      name: 'Download JS',
      icon: FileCode,
      onClick: downloadJS,
      color: 'text-yellow-600 dark:text-yellow-400',
      disabled: !component.jsCode
    },
    {
      name: 'Download ZIP',
      icon: Archive,
      onClick: downloadZIP,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      name: copied === 'all' ? 'Copied!' : 'Copy All Code',
      icon: copied === 'all' ? Check : Copy,
      onClick: copyAllCode,
      color: 'text-gray-600 dark:text-gray-400'
    }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
          isOpen
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <Download className="w-5 h-5" />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-transparent"
              onClick={() => setIsOpen(false)}
              style={{ pointerEvents: 'auto' }}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                left: `${dropdownPosition.left}px`,
                top: `${dropdownPosition.top}px`,
                zIndex: 9999,
                pointerEvents: 'auto'
              }}
              className="w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2">
                {exportOptions.map((option, index) => {
                  const Icon = option.icon
                  return (
                    <motion.button
                      key={option.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={option.onClick}
                      disabled={option.disabled}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        option.disabled ? 'opacity-50 cursor-not-allowed' : option.color
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{option.name}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </>
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

export default ExportDropdown
