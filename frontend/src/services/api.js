const BASE_URL = "";

/**
 * Sends a message to the backend and returns the AI response.
 * @param {string} query - The user's message text
 * @returns {Promise<{ticketId: number, response: string}>}
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
