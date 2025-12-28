import { useState, useEffect, useRef } from 'react'

interface ComponentPreviewProps {
  htmlCode: string
  cssCode: string
  jsCode?: string
  name: string
  height?: number
  lazy?: boolean
}

const ComponentPreview = ({ 
  htmlCode, 
  cssCode, 
  jsCode = '', 
  name,
  height: _height = 192,
  lazy = true
}: ComponentPreviewProps) => {
  const [loadError, setLoadError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(!lazy)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!lazy || shouldLoad) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    if (iframeRef.current) {
      observer.observe(iframeRef.current.parentElement!)
      observerRef.current = observer
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [lazy, shouldLoad])

  const previewDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            overflow: hidden;
          }
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        ${jsCode ? `<script>${jsCode}</script>` : ''}
      </body>
    </html>
  `

  if (loadError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-gray-500 text-sm">Preview không khả dụng</p>
        </div>
      </div>
    )
  }

  if (lazy && !shouldLoad) {
    return (
      <div 
        ref={iframeRef as any}
        className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
      >
        <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative bg-white overflow-hidden">
      <iframe
        ref={iframeRef}
        srcDoc={previewDoc}
        title={`Preview ${name}`}
        className="absolute inset-0 w-full h-full border-0 pointer-events-none"
        style={{ 
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        onError={() => setLoadError(true)}
      />
    </div>
  )
}

export default ComponentPreview
