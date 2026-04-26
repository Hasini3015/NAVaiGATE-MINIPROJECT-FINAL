import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, User, Bot, Trash2, Copy, RotateCcw, Compass, Zap } from 'lucide-react'

const SUGGESTIONS = [
  'Plan a 5-day trip to Goa for 2 people with ₹20,000 budget',
  'Best time to visit Ladakh and what to pack?',
  'Create a budget itinerary for Manali',
  'Hidden gems in Rajasthan for solo travelers',
  'What are the top beaches in Andaman?',
  'Family-friendly activities in Shimla',
]

const BOT_RESPONSES = {
  default: [
    `Great question! 🌟 Here's what I'd suggest for your trip:

**Day 1 — Arrival & Acclimatization**
- Check into your hotel and freshen up
- Evening stroll along the beachfront
- Dinner at a local seafood shack (₹400-600)

**Day 2 — Exploration**
- Morning: Visit the famous landmark by 7am to avoid crowds
- Afternoon: Local market shopping and street food
- Evening: Sunset viewpoint

**Budget Breakdown:**
- Accommodation: ₹800-1200/night
- Food: ₹600-900/day
- Transport: ₹300-500/day
- Activities: ₹500-1000/day

**Total Estimated: ₹12,000-18,000 for 5 days**

Would you like me to generate a detailed day-by-day itinerary or adjust the budget?`,

    `Sure! Here's a quick overview 🗺️

India has some incredible destinations for every type of traveler. Based on your preferences, I'd recommend:

1. **Goa** — Perfect for beach lovers, nightlife, and water sports. Best visited Oct-Feb.
2. **Manali** — Ideal for adventure seekers. River rafting, skiing, and snow activities.
3. **Pondicherry** — French colonial charm, pristine beaches, spiritual Auroville.

Each destination offers something unique. Tell me more about your travel style and I'll craft the perfect plan!`,

    `Here's your personalized travel guide! ✈️

**Getting There:**
- Flights from major cities: ₹3,000-8,000 round trip
- Train options: ₹500-2,000 (Rajdhani/Shatabdi)
- Road trip: 6-8 hours from nearest metro

**Must-Visit Spots:**
🌊 Beaches: Palolem, Agonda, Vagator
🏛️ Heritage: Old Goa churches, Fort Aguada
🍽️ Food: Konkan cuisine, fresh seafood
🛍️ Shopping: Anjuna flea market

**Pro Tips:**
- Book accommodation 2 weeks in advance
- Carry sunscreen and light cotton clothes
- Avoid peak season (Dec-Jan) for budget travel

Want me to book any of these or create a full day-by-day plan?`
  ]
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <div className="typing-dot w-2 h-2 bg-teal-400 rounded-full" />
        <div className="typing-dot w-2 h-2 bg-teal-400 rounded-full" />
        <div className="typing-dot w-2 h-2 bg-teal-400 rounded-full" />
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex gap-3 message-enter ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser
          ? 'bg-gradient-to-br from-amber-500 to-orange-500'
          : 'bg-gradient-to-br from-teal-500 to-blue-500'
      }`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      {/* Bubble */}
      <div className={`group max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-gradient-to-br from-teal-600 to-teal-500 text-white rounded-tr-sm'
            : 'glass text-slate-200 rounded-tl-sm'
        }`}>
          {/* Format bold text */}
          {msg.content.split('\n').map((line, i) => (
            <span key={i}>
              {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                  : part
              )}
              {i < msg.content.split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>

        {/* Actions */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-slate-600 hover:text-slate-400 text-xs px-2 py-1"
          >
            <Copy className="w-3 h-3" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}

        <span className="text-slate-600 text-xs px-1">{msg.time}</span>
      </div>
    </div>
  )
}

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      content: `Namaste! 🙏 I'm NavAI, your intelligent travel companion for India.\n\nI can help you:\n🗺️ **Plan personalized itineraries** for any Indian destination\n💰 **Budget your trip** across different comfort levels\n🌤️ **Check best travel seasons** and weather tips\n🏨 **Recommend stays** from budget hostels to luxury resorts\n🍛 **Discover local food** and hidden gems\n\nWhat adventure are you planning? Tell me your destination, dates, and budget!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text) => {
    const content = text || input.trim()
    if (!content) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const responses = BOT_RESPONSES.default
      const botResponse = responses[Math.floor(Math.random() * responses.length)]

      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        content: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 1500 + Math.random() * 1000)
  }

  const clearChat = () => {
    setMessages([{
      id: 1,
      role: 'bot',
      content: 'Chat cleared! Ready to plan your next adventure? 🌟',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
  }

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Header */}
      <div className="glass border-b border-teal-500/10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-white">NavAI Assistant</h1>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                  <span className="text-teal-400 text-xs">Online</span>
                </div>
              </div>
              <p className="text-slate-500 text-xs">Your AI-powered India travel expert</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={clearChat} className="btn-ghost flex items-center gap-1.5 text-xs">
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
          {messages.map(msg => (
            <Message key={msg.id} msg={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="max-w-4xl mx-auto px-4 pb-4 w-full">
          <p className="text-slate-500 text-xs mb-3 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-teal-500" /> Quick prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="glass-light text-slate-300 hover:text-teal-400 hover:border-teal-500/30 text-xs px-3 py-2 rounded-xl transition-all duration-200 text-left"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass border-t border-teal-500/10 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Ask me about any destination in India..."
                rows={1}
                className="input-field resize-none pr-12 max-h-32 overflow-y-auto"
                style={{ height: 'auto', minHeight: '48px' }}
                onInput={e => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0"
            >
              <Send className="w-5 h-5 text-navy-950" />
            </button>
          </div>
          <p className="text-slate-600 text-xs mt-2 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
