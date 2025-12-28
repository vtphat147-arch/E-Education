import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Facebook, Twitter, Linkedin, Link2, Check, ChevronDown } from 'lucide-react'

interface ShareDropdownProps {
  componentId: number
  componentName: string
  componentUrl?: string
}

const ShareDropdown = ({ componentId, componentName, componentUrl }: ShareDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
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

  const baseUrl = componentUrl || window.location.origin
  const shareUrl = `${baseUrl}/components/${componentId}`
  const shareText = `Check out this amazing UI component: ${componentName}`

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
    setIsOpen(false)
  }

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=600,height=400')
    setIsOpen(false)
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
    setIsOpen(false)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setIsOpen(false)
      }, 1500)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setIsOpen(false)
      }, 1500)
    }
  }

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: shareToFacebook,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: shareToTwitter,
      color: 'text-sky-500 dark:text-sky-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: shareToLinkedIn,
      color: 'text-blue-700 dark:text-blue-400'
    },
    {
      name: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? Check : Link2,
      onClick: copyLink,
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
        <Share2 className="w-5 h-5" />
        <span className="hidden sm:inline">Chia sẻ</span>
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
                {shareOptions.map((option, index) => {
                  const Icon = option.icon
                  return (
                    <motion.button
                      key={option.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={option.onClick}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${option.color}`}
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

export default ShareDropdown

