import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, FileCode, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { DesignComponent } from '../services/api'

interface FrameworkCodeGeneratorProps {
  component: DesignComponent
}

type Framework = 'react' | 'vue' | 'angular'

const FrameworkCodeGenerator = ({ component }: FrameworkCodeGeneratorProps) => {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('react')
  const [copied, setCopied] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)


  const convertHtmlToJsx = (html: string): string => {
    // Convert class to className
    let jsx = html.replace(/\s+class=/g, ' className=')
    
    // Convert inline styles if any
    // Remove script tags (will be handled separately)
    jsx = jsx.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    
    // Convert self-closing tags
    jsx = jsx.replace(/<(\w+)([^>]*?)\s*\/>/g, '<$1$2 />')
    
    return jsx.trim()
  }

  const generateReactCode = (): string => {
    const jsxHtml = convertHtmlToJsx(component.htmlCode)
    
    return `import React from 'react';
import './${component.name.replace(/\s+/g, '')}.css';

const ${component.name.replace(/\s+/g, '')} = () => {
  return (
    ${jsxHtml.split('\n').map((line, i) => i === 0 ? line : '    ' + line).join('\n')}
  );
};

${component.jsCode ? `
// JavaScript logic
${component.jsCode}
` : ''}

export default ${component.name.replace(/\s+/g, '')};
`
  }

  const generateVueCode = (): string => {
    const vueHtml = component.htmlCode
      .replace(/class=/g, ':class=') // Vue uses :class for dynamic classes
      .replace(/class="/g, 'class="') // But keep static class
      .replace(/\{\{/g, '{{') // Keep Vue templates
    
    return `<template>
  <div class="${component.name.replace(/\s+/g, '-').toLowerCase()}">
${vueHtml.split('\n').map(line => '    ' + line).join('\n')}
  </div>
</template>

<script>
export default {
  name: '${component.name.replace(/\s+/g, '')}',
  ${component.jsCode ? `
  mounted() {
    ${component.jsCode}
  }` : ''}
}
</script>

<style scoped>
${component.cssCode}
</style>
`
  }

  const generateAngularCode = (): string => {
    const componentName = component.name.replace(/\s+/g, '')
    const selector = component.name.replace(/\s+/g, '-').toLowerCase()
    
    return `// ${componentName}.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-${selector}',
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.css']
})
export class ${componentName}Component {
  ${component.jsCode ? `
  ngOnInit() {
    ${component.jsCode}
  }` : ''}
}

// ${componentName}.component.html
${component.htmlCode}

// ${componentName}.component.css
${component.cssCode}
`
  }

  const getGeneratedCode = (): string => {
    switch (selectedFramework) {
      case 'react':
        return generateReactCode()
      case 'vue':
        return generateVueCode()
      case 'angular':
        return generateAngularCode()
      default:
        return ''
    }
  }

  const handleCopy = async () => {
    const code = getGeneratedCode()
    await navigator.clipboard.writeText(code)
    setCopied(selectedFramework)
    setTimeout(() => setCopied(null), 2000)
  }

  const frameworks = [
    { id: 'react' as Framework, name: 'React', icon: '⚛️', color: 'bg-blue-600' },
    { id: 'vue' as Framework, name: 'Vue.js', icon: '🟢', color: 'bg-green-600' },
    { id: 'angular' as Framework, name: 'Angular', icon: '🔴', color: 'bg-red-600' }
  ]

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-900">Framework Code Generator</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              {/* Framework Selector */}
              <div className="flex gap-3">
                {frameworks.map((framework) => (
                  <motion.button
                    key={framework.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFramework(framework.id)}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                      selectedFramework === framework.id
                        ? `${framework.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl mr-2">{framework.icon}</span>
                    {framework.name}
                  </motion.button>
                ))}
              </div>

              {/* Generated Code */}
              <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300 text-sm font-medium">
                      {selectedFramework === 'react' && 'Component.tsx'}
                      {selectedFramework === 'vue' && 'Component.vue'}
                      {selectedFramework === 'angular' && 'Component files'}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    {copied === selectedFramework ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </motion.button>
                </div>
                <pre className="p-4 text-gray-300 text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
                  <code>{getGeneratedCode()}</code>
                </pre>
              </div>

              <p className="text-xs text-gray-500 text-center">
                ⚠️ Generated code may require manual adjustments for optimal integration
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FrameworkCodeGenerator

