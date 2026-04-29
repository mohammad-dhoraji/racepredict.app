export function createTierItemImage(title, accent, shadow = "#111111") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${shadow}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="28" fill="url(#bg)" />
      <rect x="18" y="18" width="204" height="204" rx="20" fill="none" stroke="rgba(255,255,255,0.16)" />
      <circle cx="188" cy="54" r="18" fill="rgba(255,255,255,0.18)" />
      <path d="M22 172h196" stroke="rgba(255,255,255,0.2)" stroke-width="4" stroke-linecap="round" />
      <text
        x="24"
        y="138"
        fill="white"
        font-family="Arial, Helvetica, sans-serif"
        font-size="28"
        font-weight="700"
        letter-spacing="1.5"
      >
        ${title}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    svg.replace(/\s+/g, " ").trim()
  )}`;
}
