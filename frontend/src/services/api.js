const BASE_URL = "";

/**
 * Sends a message to the backend and returns the AI response.
 * @param {string} query - The user's message text
 * @returns {Promise<{ticketId: number, aiResponse: string}>}
 */
export async function sendMessage(query) {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetches all tickets.
 * @returns {Promise<Array>}
 */
export async function getTickets() {
  const res = await fetch(`${BASE_URL}/tickets`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetches a single ticket by ID with its messages.
 * @param {number|string} id
 * @returns {Promise<{ticket: Object, messages: Array}>}
 */
export async function getTicketById(id) {
  const res = await fetch(`${BASE_URL}/tickets/${id}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Updates the status of a ticket.
 * @param {number|string} id
 * @param {string} status - "OPEN" | "RESOLVED" | "NEEDS_HUMAN"
 * @returns {Promise<Object>}
 */
export async function updateTicketStatus(id, status) {
  const res = await fetch(`${BASE_URL}/tickets/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
