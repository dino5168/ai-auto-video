import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Menu, Send, Bot, User } from 'lucide-react'
import { Sidebar } from './components/layout/Sidebar'
import './App.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: Message = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setStreaming(true)

    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages([...history, assistantMsg])

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') break
          try {
            const { content } = JSON.parse(payload)
            if (content) {
              setMessages(prev => {
                const next = [...prev]
                next[next.length - 1] = {
                  ...next[next.length - 1],
                  content: next[next.length - 1].content + content,
                }
                return next
              })
            }
          } catch {}
        }
      }
    } catch (e) {
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', content: '⚠ Connection error.' }
        return next
      })
    } finally {
      setStreaming(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 bg-[#1E1B3A] px-4 py-3 lg:hidden shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-[#AFA9EC] hover:bg-[#2A2550]"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold text-white">ApexDashboard</span>
        </header>

      <section id="center" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#12102A' }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6B6A8A', marginTop: '80px' }}>
              <Bot size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
              <p style={{ fontSize: '1rem' }}>How can I help you today?</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 24px',
                background: msg.role === 'assistant' ? '#1A1830' : 'transparent',
                borderTop: '1px solid #1E1C38',
                borderBottom: '1px solid #1E1C38',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '6px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: msg.role === 'assistant' ? '#7C3AED' : '#2A2550',
              }}>
                {msg.role === 'assistant'
                  ? <Bot size={16} color="#fff" />
                  : <User size={16} color="#AFA9EC" />}
              </div>
              <div style={{ flex: 1, color: '#E2E0F5', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', paddingTop: '4px' }}>
                {msg.content}
                {streaming && i === messages.length - 1 && msg.role === 'assistant' && (
                  <span style={{ display: 'inline-block', width: '2px', height: '1em', background: '#7C3AED', marginLeft: '2px', verticalAlign: 'text-bottom', animation: 'blink 1s step-start infinite' }} />
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px', background: '#12102A', borderTop: '1px solid #1E1C38' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', background: '#1A1830', border: '1px solid #2A2550', borderRadius: '10px', padding: '10px 14px' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AI… (Enter to send, Shift+Enter for newline)"
              rows={1}
              disabled={streaming}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#E2E0F5', fontSize: '0.9rem', resize: 'none', lineHeight: 1.6,
                maxHeight: '160px', overflowY: 'auto', fontFamily: 'inherit',
              }}
              onInput={e => {
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = el.scrollHeight + 'px'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={streaming || !input.trim()}
              style={{
                background: streaming || !input.trim() ? '#2A2550' : '#7C3AED',
                border: 'none', borderRadius: '6px', padding: '6px 10px',
                cursor: streaming || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', transition: 'background 0.2s',
              }}
            >
              <Send size={16} color={streaming || !input.trim() ? '#6B6A8A' : '#fff'} />
            </button>
          </div>
          <p style={{ textAlign: 'center', color: '#4A4870', fontSize: '0.75rem', marginTop: '8px' }}>
            AI may make mistakes. Verify important information.
          </p>
        </div>
      </section>
      </div>
    </div>
  )
}


export default App
