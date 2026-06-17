/**
 * Creator Cofounder — API Client
 * Interfaces with the FastAPI backend services.
 */

// In production (Vercel), VITE_API_URL points to the deployed backend.
// In development, the Vite proxy handles /api → localhost:8000.
const API_BASE = import.meta.env.VITE_API_URL || ''

async function request(url, options = {}) {
  // Prepend backend base URL for production
  const fullUrl = url.startsWith('/api') ? `${API_BASE}${url}` : url
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(fullUrl, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.detail || errorMessage;
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  /** Scrape handle details and verified email */
  scrapeCreator: (handle, platform = 'youtube') => {
    return request('/api/cofounder/scrape', {
      method: 'POST',
      body: JSON.stringify({ handle, platform })
    });
  },

  /** Get product ideas for creator */
  getCreatorIdeas: (creatorId) => {
    return request(`/api/cofounder/creators/${creatorId}/ideas`);
  },

  /** Select an idea, approve it, and generate landing page outline + scaffold */
  selectIdea: (creatorId, ideaId) => {
    return request(`/api/cofounder/creators/${creatorId}/select-idea`, {
      method: 'POST',
      body: JSON.stringify({ idea_id: ideaId })
    });
  },

  /** Fetch dashboard payload containing profile, ideas, scaffold, outreach log, and suggestions */
  getDashboard: (creatorId) => {
    return request(`/api/cofounder/creators/${creatorId}/dashboard`);
  },

  /** Generate personalized outreach email draft */
  generateOutreachDraft: (creatorId, tone = 'friendly') => {
    return request(`/api/cofounder/creators/${creatorId}/outreach/generate?tone=${encodeURIComponent(tone)}`, {
      method: 'POST'
    });
  },

  /** Send outreach email via Resend */
  sendOutreachEmail: (creatorId, subject, body) => {
    return request(`/api/cofounder/creators/${creatorId}/outreach/send`, {
      method: 'POST',
      body: JSON.stringify({ subject, body })
    });
  },

  /** Trigger drip sequence checks */
  triggerDrip: () => {
    return request('/api/cofounder/outreach/drip', {
      method: 'POST'
    });
  }
};
