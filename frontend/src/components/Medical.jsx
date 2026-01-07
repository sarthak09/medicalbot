import React, { useState, useRef, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Medical = () => {
  const initialMessage = {
    id: 1,
    role: "assistant",
    text: "Hi! I'm your medical assistant. Ask me a question based on the documents I've been trained on 👋",
  };

  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setErrorMsg("");

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/medical`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`Backend returned status ${res.status}`);
      }

      const data = await res.json();

      let botText;
      if (data.status === "success") {
        if (typeof data.response === "string") {
          botText = data.response;
        } else {
          botText = JSON.stringify(data.response, null, 2);
        }
      } else {
        botText =
          data.message || "I couldn't generate a response. Please try again.";
      }

      const botMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: botText,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not reach the backend. Check if Flask is running.");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          text:
            "There was a problem contacting the server. Please make sure the backend is running on http://localhost:5000.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([initialMessage]);
    setInput("");
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Main Container - Centered */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        height: '90vh',
        maxHeight: '800px',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        animation: 'fadeInScale 0.6s ease-out'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.75rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated background shapes */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <i className="bi bi-heart-pulse-fill" style={{ fontSize: '1.75rem', color: 'white' }}></i>
                </div>
                <div>
                  <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: 'white',
                    margin: 0,
                    letterSpacing: '-0.5px'
                  }}>Medical Assistant</h1>
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.85)',
                    margin: 0,
                    fontWeight: '400'
                  }}>RAG-Powered Healthcare Support</p>
                </div>
              </div>
              <button
                onClick={handleClear}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <i className="bi bi-arrow-clockwise"></i>
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          background: 'linear-gradient(to bottom, #f8f9ff 0%, #ffffff 100%)',
          position: 'relative'
        }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === "user" ? 'flex-end' : 'flex-start',
                  marginBottom: '1.5rem',
                  animation: 'slideIn 0.4s ease-out',
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'both'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: msg.role === "user" ? 'row-reverse' : 'row',
                  maxWidth: '80%',
                  gap: '0.75rem'
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: msg.role === "user" 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <i className={`bi ${msg.role === "user" ? "bi-person-fill" : "bi-robot"}`} 
                       style={{ color: 'white', fontSize: '1.25rem' }}></i>
                  </div>

                  {/* Message Content */}
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: msg.role === "user" ? '#667eea' : '#f5576c',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {msg.role === "user" ? "You" : "Medical AI"}
                    </div>
                    <div style={{
                      background: msg.role === "user"
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'white',
                      color: msg.role === "user" ? 'white' : '#2d3748',
                      padding: '1rem 1.25rem',
                      borderRadius: msg.role === "user" ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      boxShadow: msg.role === "user" 
                        ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                        : '0 4px 12px rgba(0, 0, 0, 0.08)',
                      lineHeight: '1.6',
                      fontSize: '0.95rem',
                      border: msg.role === "user" ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = msg.role === "user" 
                        ? '0 6px 16px rgba(102, 126, 234, 0.4)'
                        : '0 6px 16px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = msg.role === "user" 
                        ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                        : '0 4px 12px rgba(0, 0, 0, 0.08)';
                    }}>
                      {msg.text.split("\n").map((line, idx) => (
                        <p key={idx} style={{ 
                          margin: idx === msg.text.split("\n").length - 1 ? 0 : '0 0 0.5rem 0'
                        }}>
                          {line || "\u00A0"}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading State */}
            {loading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '1.5rem',
                animation: 'slideIn 0.4s ease-out'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  maxWidth: '80%'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}>
                    <i className="bi bi-robot" style={{ color: 'white', fontSize: '1.25rem' }}></i>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#f5576c',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Medical AI
                    </div>
                    <div style={{
                      background: 'white',
                      padding: '1rem 1.25rem',
                      borderRadius: '18px 18px 18px 4px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div className="spinner-border spinner-border-sm" 
                           style={{ color: '#f5576c', width: '1.25rem', height: '1.25rem' }}></div>
                      <span style={{ color: '#718096', fontSize: '0.95rem' }}>Analyzing your question...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div style={{
            margin: '0 2rem 1rem 2rem',
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, #fc5c65 0%, #fd7e14 100%)',
            color: 'white',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 4px 12px rgba(252, 92, 101, 0.3)',
            animation: 'slideIn 0.4s ease-out'
          }}>
            <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '1.25rem' }}></i>
            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{errorMsg}</span>
          </div>
        )}

        {/* Input Area */}
        <div style={{
          padding: '1.5rem 2rem',
          background: 'white',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-end'
            }}>
              <div style={{ flex: 1 }}>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Type your medical question here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  style={{
                    resize: 'none',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: '14px',
                    padding: '0.875rem 1.125rem',
                    fontSize: '0.95rem',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fafbff'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.backgroundColor = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                    e.target.style.backgroundColor = '#fafbff';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <small style={{
                  display: 'block',
                  marginTop: '0.5rem',
                  color: '#718096',
                  fontSize: '0.8rem'
                }}>
                  <i className="bi bi-info-circle me-1"></i>
                  Press Enter to send, Shift+Enter for new line
                </small>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim() 
                    ? '#cbd5e0' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '0.875rem 2rem',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: loading || !input.trim() 
                    ? 'none' 
                    : '0 4px 12px rgba(102, 126, 234, 0.3)',
                  height: 'fit-content'
                }}
                onMouseEnter={(e) => {
                  if (!loading && input.trim()) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = loading || !input.trim() 
                    ? 'none' 
                    : '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-fill"></i>
                    Send
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        /* Custom scrollbar */
        div::-webkit-scrollbar {
          width: 8px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
      `}</style>
    </div>
  );
};

export default Medical;