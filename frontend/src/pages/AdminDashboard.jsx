import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTickets } from "../services/api";
import "./AdminDashboard.css";

const FILTERS = ["ALL", "OPEN", "RESOLVED", "NEEDS_HUMAN"];

function getTimeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function getStatusClass(status) {
  switch (status) {
    case "OPEN": return "status--open";
    case "RESOLVED": return "status--resolved";
    case "NEEDS_HUMAN": return "status--needs-human";
    default: return "";
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "NEEDS_HUMAN": return "NEEDS HUMAN";
    default: return status;
  }
}

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets =
    activeFilter === "ALL"
      ? tickets
      : tickets.filter((t) => t.status === activeFilter);

  return (
    <div className="admin-page">
      {/* Top Nav */}
      <nav className="admin-nav">
        <div className="admin-nav__left">
          <div className="admin-nav__logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="admin-nav__title">MindX Support AI</span>
        </div>
        <button className="admin-nav__chat-btn" onClick={() => navigate("/")}>
          Customer Chat
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-header__title">Admin Dashboard</h1>
          <p className="admin-header__subtitle">
            Central queue for active support inquiries and AI escalations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`filter-tab ${activeFilter === filter ? "filter-tab--active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "NEEDS_HUMAN" ? "NEEDS HUMAN" : filter}
            </button>
          ))}
        </div>

        {/* Ticket Cards */}
        <div className="ticket-list">
          {loading && (
            <div className="ticket-list__empty">
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
              <p>Loading tickets...</p>
            </div>
          )}

          {!loading && filteredTickets.length === 0 && (
            <div className="ticket-list__empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p>No tickets found.</p>
            </div>
          )}

          {!loading &&
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="ticket-card"
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <div className="ticket-card__top">
                  <div className="ticket-card__meta">
                    <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                      {getStatusLabel(ticket.status)}
                    </span>
                    <span className="ticket-card__id">ID: #{ticket.id}</span>
                  </div>
                  <span className="ticket-card__time">{getTimeAgo(ticket.createdAt)}</span>
                </div>
                <p className="ticket-card__query">"{ticket.query}"</p>
                <div className="ticket-card__bottom">
                  <div className="ticket-card__avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <footer className="admin-footer">
          <div className="admin-footer__left">
            <span className="footer-dot footer-dot--live"></span>
            LIVE CONNECTION: ESTABLISHED
            <span className="footer-separator">•</span>
            NODE: 10-EAST-1
          </div>
          <span className="admin-footer__right">
            © 2026 • MINDX SERVICE SYSTEMS
          </span>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
