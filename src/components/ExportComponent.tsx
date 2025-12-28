import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Code, FileCode, Archive, Copy, Check } from 'lucide-react'
import { DesignComponent } from '../services/api'

interface ExportComponentProps {
  component: DesignComponent
}

const ExportComponent = ({ component }: ExportComponentProps) => {
  const [copied, setCopied] = useState<string | null>(null)

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
      // Using JSZip for ZIP creation
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      // Add HTML file
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

      // Generate README
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
  }

  const exportOptions = [
    {
      name: 'Download HTML',
      icon: FileText,
      onClick: downloadHTML,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Download CSS',
      icon: Code,
      onClick: downloadCSS,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      name: 'Download JS',
      icon: FileCode,
      onClick: downloadJS,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      disabled: !component.jsCode
    },
    {
      name: 'Download ZIP',
      icon: Archive,
      onClick: downloadZIP,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: copied === 'all' ? 'Copied!' : 'Copy All Code',
      icon: copied === 'all' ? Check : Copy,
      onClick: copyAllCode,
      color: copied === 'all' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
    }
  ]

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-900">Export Component</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {exportOptions.map((option, index) => (
          <motion.button
            key={option.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={option.onClick}
            disabled={option.disabled}
            className={`${option.color} ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''} text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all`}
          >
            <option.icon className="w-5 h-5" />
            <span>{option.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default ExportComponent

