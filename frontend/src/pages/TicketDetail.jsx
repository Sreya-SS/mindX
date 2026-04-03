import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById, updateTicketStatus } from "../services/api";
import "./TicketDetail.css";

const STATUS_OPTIONS = ["OPEN", "RESOLVED", "NEEDS_HUMAN"];

function getStatusClass(status) {
  switch (status) {
    case "OPEN": return "td-status--open";
    case "RESOLVED": return "td-status--resolved";
    case "NEEDS_HUMAN": return "td-status--needs-human";
    default: return "";
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "NEEDS_HUMAN": return "NEEDS HUMAN";
    default: return status;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTicketDetail();
  }, [id]);

  const fetchTicketDetail = async () => {
    try {
      setLoading(true);
      const data = await getTicketById(id);
      setTicket(data.ticket);
      setMessages(data.messages || []);
      setSelectedStatus(data.ticket.status);
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus || updating) return;
    try {
      setUpdating(true);
      await updateTicketStatus(id, selectedStatus);
      setTicket((prev) => ({ ...prev, status: selectedStatus }));
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="td-page">
        <div className="td-loading">
          <div className="td-loading__dots">
            <span></span><span></span><span></span>
          </div>
          <p>Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="td-page">
        <div className="td-loading">
          <p>Ticket not found.</p>
          <button className="td-back-btn" onClick={() => navigate("/admin")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="td-page">
      {/* Header Bar */}
      <div className="td-header-bar">
        <div className="td-header-bar__left">
          <button className="td-back-link" onClick={() => navigate("/admin")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="td-ticket-badge">TICKET #{id}</span>
          <span className="td-header-name">MindX AI</span>
          <span className={`td-status-pill ${getStatusClass(ticket.status)}`}>
            {getStatusLabel(ticket.status)}
          </span>
        </div>
        <button className="td-menu-btn" aria-label="Menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {/* Opened Info */}
      <div className="td-opened-info">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>OPENED: {formatDate(ticket.createdAt)}</span>
      </div>

      {/* Messages */}
      <div className="td-messages">
        {messages.map((msg, index) => {
          const isUser = msg.sender === "USER";
          return (
            <div
              key={index}
              className={`td-msg ${isUser ? "td-msg--user" : "td-msg--ai"}`}
            >
              {!isUser && (
                <div className="td-msg__label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 0 1 4 4v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6a4 4 0 0 1 4-4z" />
                    <path d="M9 8v1a3 3 0 0 0 6 0V8" />
                    <path d="M12 12v3" />
                    <path d="M8 22h8" />
                    <path d="M12 15l-4 7" />
                    <path d="M12 15l4 7" />
                  </svg>
                  AETHER INTELLIGENCE
                </div>
              )}
              <div className={`td-msg__bubble ${isUser ? "td-msg__bubble--user" : "td-msg__bubble--ai"}`}>
                <p className="td-msg__text">{msg.message}</p>
              </div>
              {isUser && (
                <div className="td-msg__user-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  USER
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Control Panel */}
      <div className="td-control">
        <div className="td-control__header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>CONTROL PANEL</span>
        </div>

        <div className="td-control__body">
          <label className="td-control__label">CURRENT TICKET STATUS</label>
          <div className="td-control__actions">
            <select
              className="td-control__select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={updating}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              className="td-control__update-btn"
              onClick={handleUpdateStatus}
              disabled={updating}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              {updating ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="td-footer">
        <span>MindX AI — Internal Management Terminal Page</span>
      </div>
    </div>
  );
}

export default TicketDetail;
