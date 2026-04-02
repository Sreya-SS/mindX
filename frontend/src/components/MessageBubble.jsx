import "./MessageBubble.css";

function MessageBubble({ sender, text }) {
  const isUser = sender === "USER";

  return (
    <div className={`message-row ${isUser ? "message-row--user" : "message-row--ai"}`}>
      {!isUser && (
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
      )}
      <div className={`message-bubble ${isUser ? "message-bubble--user" : "message-bubble--ai"}`}>
        <p className="message-text">{text}</p>
        <span className="message-meta">
          {isUser ? "You" : "MindX AI"}
        </span>
      </div>
      {isUser && (
        <div className="message-avatar message-avatar--user">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
