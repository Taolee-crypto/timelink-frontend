/*!
 * TimeLink TL3 config
 * ----------------------------------------------------------------------------
 * Resolves the base URL of the TL3 server (MP3→TL3 conversion + TL3 streaming).
 *
 * Priority:
 *   1. window.TL3_API_BASE  — set explicitly before this script loads
 *   2. same origin          — when the site itself is served by the TL3 server
 *   3. TL3_FALLBACK_BASE    — a configured remote TL3 server
 *
 * Load this AFTER tl3.js and BEFORE the page's player logic.
 */
(function (global) {
  'use strict';

  // Default to same-origin so the TL3 server hosts both the site and the API.
  // Set window.TL3_API_BASE = 'https://tl3.example.com' before this script to
  // point at a separately hosted TL3 server.
  var base = global.TL3_API_BASE;
  if (base === undefined) base = '';

  global.TL3_API_BASE = base;

  // Convenience: a resolver for a track id → stream URL on the TL3 server.
  global.TL3StreamUrl = function (id) {
    return global.TL3_API_BASE + '/api/stream/' + encodeURIComponent(id);
  };
})(window);
