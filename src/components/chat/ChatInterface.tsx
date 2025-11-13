'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { PaperAirplaneIcon, ChevronDownIcon, CameraIcon, PhotoIcon } from '@heroicons/react/24/outline'
import Icon from '@/components/common/Icon'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Capability {
  name: string
  description: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isButtonsVisible, setIsButtonsVisible] = useState(true)
  const [showScanModal, setShowScanModal] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const capabilities: Capability[] = [
    { name: 'Inventory', description: 'Manage your home inventory' },
    { name: 'Budget', description: 'Track and plan your budget' },
    { name: 'Recipes', description: 'Find and save recipes' },
    { name: 'Tasks', description: 'Manage household tasks' },
    { name: 'Shopping', description: 'Create shopping lists' },
    { name: 'Maintenance', description: 'Track home maintenance' }
  ]

  useEffect(() => {
    if (input.trim()) {
      setIsButtonsVisible(false)
    }
  }, [input])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev: Message[]) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // TODO: Implement AI response logic
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'I understand your request. How can I help you with that?'
      }
      setMessages((prev: Message[]) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleScan = () => {
    setShowScanModal(true)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Handle file upload
      console.log('File uploaded:', file)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {capabilities.map((capability) => (
              <button
                key={capability.name}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setInput(`Help me with ${capability.name.toLowerCase()}`)}
              >
                <h3 className="font-semibold text-navy-600">{capability.name}</h3>
                <p className="text-sm text-gray-600">{capability.description}</p>
              </button>
            ))}
          </div>
        ) : (
          messages.map((message: Message, index: number) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 mr-3">
                  <Image
                    src="/avatar-placeholder.png"
                    alt="Assistant Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-navy-600 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="relative">
        {!isButtonsVisible && (
          <div className="absolute bottom-full left-0 right-0 bg-white border-b border-gray-200 p-2 flex justify-center">
            <button
              onClick={() => setIsButtonsVisible(true)}
              className="text-navy-600 hover:text-navy-700"
            >
              <Icon icon={ChevronDownIcon} className="w-5 h-5" aria-hidden={true} />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleScan}
              className="p-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700"
            >
              Scan
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder="Ask me anything about your home..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 disabled:opacity-50"
            >
              <Icon icon={PaperAirplaneIcon} className="w-5 h-5" aria-hidden={true} />
            </button>
          </div>
        </form>
      </div>

      {showScanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Scan Item</h2>
            <div className="space-y-4">
              <button
                onClick={() => {
                  // TODO: Implement camera functionality
                  console.log('Open camera')
                }}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700"
              >
                <Icon icon={CameraIcon} className="w-5 h-5" aria-hidden={true} />
                <span>Use Camera</span>
              </button>
              <label className="w-full flex items-center justify-center space-x-2 p-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700 cursor-pointer">
                <Icon icon={PhotoIcon} className="w-5 h-5" aria-hidden={true} />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowScanModal(false)}
                className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 