import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Droplet } from 'lucide-react';

const QUICK_REPLIES = [
  'How do I donate blood?',
  'Am I eligible to donate?',
  'How to request blood?',
  'What blood components do you collect?',
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "👋 Hi! I'm **Apheresis AI**, your intelligent blood bank assistant powered by Gemini.\n\nHow can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const query = text || input;
    if (!query.trim()) return;

    // Add user message to UI
    const userMsg = { text: query, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Call backend which now uses Gemini API
      const response = await axios.post('http://localhost:8080/api/v1/chatbot/ask', { query });
      
      setMessages(prev => [...prev, { text: response.data.answer, isBot: true }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { 
        text: "⚠️ I'm having trouble connecting to my AI brain. Please make sure the backend is running and the Gemini API key is configured.", 
        isBot: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatText = (text) =>
    text.split('\n').map((line, i) => (
      <span key={i}>{line}<br /></span>
    ));

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            borderRadius: '50%', width: '60px', height: '60px',
            background: 'var(--primary)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(214, 40, 40, 0.45)',
            transition: 'transform 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={28} color="white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="glass animate-fade-in"
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            width: '370px', height: '540px', zIndex: 1000,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}
        >
          {/* Header */}
          <div style={{ background: 'var(--primary)', padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Droplet size={18} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Apheresis AI</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  Gemini Powered · Online
                </div>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'rgba(255,240,243,0.3)' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                  background: msg.isBot ? 'white' : 'var(--primary)',
                  color: msg.isBot ? 'var(--text-color)' : 'white',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  borderBottomLeftRadius: msg.isBot ? '4px' : '16px',
                  borderBottomRightRadius: msg.isBot ? '16px' : '4px',
                  maxWidth: '85%',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                {formatText(msg.text)}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'white', padding: '10px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: `bounce 1s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}

            {/* Quick replies (show only at start) */}
            {messages.length <= 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'flex-start', width: '100%' }}>
                {QUICK_REPLIES.map((qr, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(qr)}
                    style={{
                      background: 'white', border: '1.5px solid var(--primary)',
                      color: 'var(--primary)', padding: '7px 14px',
                      borderRadius: '20px', cursor: 'pointer', fontWeight: '600',
                      fontSize: '0.85rem', textAlign: 'left',
                      transition: 'background 0.2s', alignSelf: 'flex-start'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--primary)'; }}
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '0.8rem 1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', background: 'white' }}>
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.9rem', outline: 'none' }}
            />
            <button
              onClick={() => sendMessage()}
              style={{ background: 'var(--primary)', border: 'none', borderRadius: '12px', padding: '0 16px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
