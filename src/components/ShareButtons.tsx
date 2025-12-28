import { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  componentId: number
  componentName: string
  componentUrl?: string
}

const ShareButtons = ({ componentId, componentName, componentUrl }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false)

  const baseUrl = componentUrl || window.location.origin
  const shareUrl = `${baseUrl}/components/${componentId}`
  const shareText = `Check out this amazing UI component: ${componentName}`

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const buttons = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: shareToFacebook
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      onClick: shareToTwitter
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      onClick: shareToLinkedIn
    },
    {
      name: 'Copy Link',
      icon: copied ? Check : Link2,
      color: copied ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700',
      onClick: copyLink
    }
  ]

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Chia sẻ component</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {buttons.map((button, index) => (
          <motion.button
            key={button.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={button.onClick}
            className={`${button.color} text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors`}
          >
            <button.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{button.name}</span>
          </motion.button>
        ))}
      </div>
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-sm text-green-600 font-medium"
        >
          Đã sao chép link!
        </motion.div>
      )}
    </div>
  )
}

export default ShareButtons


