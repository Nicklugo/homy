'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RecommendationEngine } from '../../services/recommendationEngine';
import { Product } from '../../types/product';
import { Analytics } from '../../services/analytics';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  products?: Product[];
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const engine = new RecommendationEngine();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Analyze message for product recommendation opportunities
    if (input.toLowerCase().includes('recommend') || 
        input.toLowerCase().includes('best') ||
        input.toLowerCase().includes('buy')) {
      const recommendations = await engine.getRecommendations({
        homeSize: 2000,
        floorTypes: ['hardwood', 'carpet'],
        hasPets: true,
        cleaningFrequency: 'weekly'
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Based on your needs, here are some recommendations:',
        sender: 'ai',
        products: recommendations.slice(0, 3)
      };

      setMessages(prev => [...prev, aiMessage]);
    } else {
      // Regular chat response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I understand you need help with cleaning. Would you like me to recommend some products that might help?',
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const handleAffiliateClick = (product: Product) => {
    Analytics.trackAffiliateClick(product);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-[80%] p-4 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-navy-600 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p>{message.text}</p>
              {message.products && (
                <div className="mt-4 grid grid-cols-1 gap-4">
                  {message.products.map(product => (
                    <a
                      key={product.id}
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleAffiliateClick(product)}
                      className="block bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-20 h-20 object-contain"
                        />
                        <div>
                          <h4 className="font-semibold text-navy-600">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            ${product.price} - ★{product.rating} ({product.reviews} reviews)
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about cleaning tips or product recommendations..."
            className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-navy-600"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-navy-600 text-white rounded-md hover:bg-navy-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 