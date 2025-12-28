import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Play, Code2, Eye, FileCode, AlertCircle } from 'lucide-react'
import { DesignComponent } from '../services/api'

interface ComponentEditorProps {
  component?: DesignComponent
  onSave?: (component: Partial<DesignComponent>) => Promise<void>
  readOnly?: boolean
}

const ComponentEditor = ({ component, onSave, readOnly = false }: ComponentEditorProps) => {
  const [htmlCode, setHtmlCode] = useState(component?.htmlCode || '')
  const [cssCode, setCssCode] = useState(component?.cssCode || '')
  const [jsCode, setJsCode] = useState(component?.jsCode || '')
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'preview'>('html')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (component) {
      setHtmlCode(component.htmlCode || '')
      setCssCode(component.cssCode || '')
      setJsCode(component.jsCode || '')
    }
  }, [component])

  const handleSave = async () => {
    if (!onSave || readOnly) return
    
    setIsSaving(true)
    setSaveStatus('idle')
    
    try {
      await onSave({
        htmlCode,
        cssCode,
        jsCode: jsCode || null
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const getPreviewCode = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body style="margin: 0; padding: 20px;">
          ${htmlCode}
          ${jsCode ? `<script>${jsCode}</script>` : ''}
        </body>
      </html>
    `
  }

  const tabs = [
    { id: 'html' as const, label: 'HTML', icon: FileCode },
    { id: 'css' as const, label: 'CSS', icon: Code2 },
    { id: 'js' as const, label: 'JS', icon: Code2 },
    { id: 'preview' as const, label: 'Preview', icon: Eye }
  ]

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html':
        return htmlCode
      case 'css':
        return cssCode
      case 'js':
        return jsCode
      default:
        return ''
    }
  }

  const setCurrentCode = (value: string) => {
    switch (activeTab) {
      case 'html':
        setHtmlCode(value)
        break
      case 'css':
        setCssCode(value)
        break
      case 'js':
        setJsCode(value)
        break
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden flex flex-col h-[700px]">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-900">
            {component ? `Edit: ${component.name}` : 'Create Component'}
          </h3>
        </div>
        {!readOnly && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
              saveStatus === 'success'
                ? 'bg-green-600 text-white'
                : saveStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saveStatus === 'success' ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : saveStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Error
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200/50 bg-gray-50/50 backdrop-blur-sm flex flex-shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-3 border-indigo-600 bg-white/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' ? (
          <div className="h-full p-6 bg-gradient-to-br from-gray-100 via-gray-50 to-white">
            <iframe
              srcDoc={getPreviewCode()}
              className="w-full h-full border-2 border-gray-200 rounded-xl bg-white shadow-inner"
              title="Component Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <textarea
              value={getCurrentCode()}
              onChange={(e) => setCurrentCode(e.target.value)}
              readOnly={readOnly}
              className="w-full h-full bg-transparent text-gray-300 font-mono text-sm resize-none outline-none p-4"
              placeholder={`Enter your ${activeTab.toUpperCase()} code here...`}
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 bg-gray-50/50 border-t border-gray-200/50 flex items-center justify-between text-xs text-gray-600 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>HTML: {htmlCode.length} chars</span>
          <span>CSS: {cssCode.length} chars</span>
          <span>JS: {jsCode.length} chars</span>
        </div>
        {!readOnly && (
          <div className="flex items-center gap-2 text-indigo-600">
            <Play className="w-3 h-3" />
            <span>Press Tab to indent</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComponentEditor

