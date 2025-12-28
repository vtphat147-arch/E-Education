import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, Code, FileCode, Archive, Copy, Check } from 'lucide-react'
import { DesignComponent } from '../services/api'

interface ExportDropdownProps {
  component: DesignComponent
}

const ExportDropdown = ({ component }: ExportDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
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
      color: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      name: 'Download CSS',
      icon: Code,
      onClick: downloadCSS,
      color: 'text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
    },
    {
      name: 'Download JS',
      icon: FileCode,
      onClick: downloadJS,
      color: 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
      disabled: !component.jsCode
    },
    {
      name: 'Download ZIP',
      icon: Archive,
      onClick: downloadZIP,
      color: 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
    },
    {
      name: copied === 'all' ? 'Copied!' : 'Copy All Code',
      icon: copied === 'all' ? Check : Copy,
      onClick: copyAllCode,
      color: 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
    }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center transition-all"
        aria-label="Export component"
      >
        <Download className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-14 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="p-2">
              {exportOptions.map((option, index) => {
                const Icon = option.icon
                return (
                  <motion.button
                    key={option.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={option.onClick}
                    disabled={option.disabled}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
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
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExportDropdown

