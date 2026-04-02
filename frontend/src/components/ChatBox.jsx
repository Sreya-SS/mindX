import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { sendMessage } from "../services/api";
import "./ChatBox.css";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Immediately append USER message
    const userMessage = { sender: "USER", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await sendMessage(trimmed);
      // Append AI message using res.aiResponse (backend field name)
      const aiText = res.aiResponse || "Sorry, I couldn't generate a response. Please try again.";
      const aiMessage = { sender: "AI", text: aiText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage = {
        sender: "AI",
        text: "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbox">
      {/* Header */}
      <div className="chatbox-header">
        <div className="chatbox-header__left">
          <div className="chatbox-header__avatar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6a4 4 0 0 1 4-4z" />
              <path d="M9 8v1a3 3 0 0 0 6 0V8" />
              <path d="M12 12v3" />
              <path d="M8 22h8" />
              <path d="M12 15l-4 7" />
              <path d="M12 15l4 7" />
            </svg>
          </div>
          <div className="chatbox-header__info">
            <h1 className="chatbox-header__title">MindX AI</h1>
            <span className="chatbox-header__status">
              <span className="status-dot"></span>
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chatbox-messages" id="chatbox-messages">
        {messages.length === 0 && (
          <div className="chatbox-empty">
            <div className="chatbox-empty__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="chatbox-empty__title">Start a Conversation</h2>
            <p className="chatbox-empty__subtitle">
              Ask MindX AI anything — we're here to help!
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <MessageBubble key={index} sender={msg.sender} text={msg.text} />
        ))}

        {isLoading && (
          <div className="message-row message-row--ai" style={{ alignSelf: "flex-start" }}>
            <div className="message-avatar message-avatar--ai">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6a4 4 0 0 1 4-4z" />
                <path d="M9 8v1a3 3 0 0 0 6 0V8" />
                <path d="M12 12v3" />
                <path d="M8 22h8" />
                <path d="M12 15l-4 7" />
                <path d="M12 15l4 7" />
              </svg>
            </div>
            <div className="message-bubble message-bubble--ai typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chatbox-input">
        <div className="chatbox-input__wrapper">
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            className="chatbox-input__field"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            id="send-button"
            className={`chatbox-input__button ${input.trim() && !isLoading ? "chatbox-input__button--active" : ""}`}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="chatbox-input__hint">
          Press <kbd>Enter</kbd> to send
        </p>
      </div>
    </div>
  );
}

export default ChatBox;
