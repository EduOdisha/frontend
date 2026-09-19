// src/config/index.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all environment-specific configuration.
// Import this file in components instead of accessing import.meta.env directly.
// ─────────────────────────────────────────────────────────────────────────────

const config = {
  // ── Backend ───────────────────────────────────────────────────────────────
  apiUrl:          import.meta.env.VITE_API_URL          || '/api',
  backendProxyUrl: import.meta.env.VITE_BACKEND_PROXY_URL || 'http://localhost:5000',

  // ── Business Contact ──────────────────────────────────────────────────────
  whatsappNumber:  import.meta.env.VITE_WHATSAPP_NUMBER  || '917205402554',
  contactPhone:    import.meta.env.VITE_CONTACT_PHONE    || '+917205402554',
  contactEmail:    import.meta.env.VITE_CONTACT_EMAIL    || 'eduodisha121@gmail.com',

  // ── Social Media ──────────────────────────────────────────────────────────
  social: {
    facebook:  import.meta.env.VITE_SOCIAL_FACEBOOK_URL  || 'https://facebook.com',
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM_URL || 'https://instagram.com',
    linkedin:  import.meta.env.VITE_SOCIAL_LINKEDIN_URL  || 'https://linkedin.com',
    youtube:   import.meta.env.VITE_SOCIAL_YOUTUBE_URL   || 'https://youtube.com',
  },
};

export default config;
