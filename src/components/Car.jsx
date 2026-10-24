/**
 * Original top-down car illustration (nose points right).
 * Class names are animation hooks used by Hero.jsx:
 *   .car-beams  headlight cones, fade in as the car starts moving
 *   .car-body   the group that yaws / bobs along the road
 */
export default function Car({ className = '' }) {
  return (
    <svg
      viewBox="0 0 600 240"
      className={className}
      style={{ overflow: 'visible' }}
      role="img"
      aria-label="Top view of a sports car"
    >
      <defs>
        <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a3d" />
          <stop offset="0.5" stopColor="#ff5a1f" />
          <stop offset="1" stopColor="#b52d08" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b2230" />
          <stop offset="1" stopColor="#05070b" />
        </linearGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#fff3c4" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* ground shadow */}
      <ellipse cx="305" cy="130" rx="270" ry="92" fill="#000" opacity="0.55" filter="url(#soft)" />

      <g className="car-body">
        {/* headlight beams */}
        <g className="car-beams" opacity="0">
          <polygon points="560,70 1020,-10 1020,110 560,98" fill="url(#beam)" />
          <polygon points="560,142 1020,130 1020,250 560,170" fill="url(#beam)" />
        </g>

        {/* wheels (drawn first so they peek out from under the body) */}
        {[
          [120, 14],
          [400, 14],
          [120, 190],
          [400, 190],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="86" height="38" rx="12" fill="#0d0d10" />
        ))}

        {/* body */}
        <path
          d="M36 120 C36 72 78 48 150 44 L430 44 C502 48 566 80 574 120 C566 160 502 192 430 196 L150 196 C78 192 36 168 36 120 Z"
          fill="url(#paint)"
        />
        {/* hood + tail centre lines */}
        <path d="M412 120 H552 M60 120 H200" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" />
        {/* side highlights */}
        <path d="M120 56 H440" stroke="#fff" strokeOpacity="0.28" strokeWidth="3" strokeLinecap="round" />

        {/* cabin */}
        <path
          d="M238 70 L372 70 C392 70 408 98 408 120 C408 142 392 170 372 170 L238 170 C222 170 210 142 210 120 C210 98 222 70 238 70 Z"
          fill="url(#glass)"
        />
        <rect x="262" y="88" width="84" height="64" rx="10" fill="#ff5a1f" opacity="0.9" />

        {/* mirrors */}
        <ellipse cx="372" cy="40" rx="14" ry="7" fill="#b52d08" />
        <ellipse cx="372" cy="200" rx="14" ry="7" fill="#b52d08" />

        {/* lights */}
        <ellipse cx="552" cy="82" rx="12" ry="7" fill="#fff6d6" />
        <ellipse cx="552" cy="158" rx="12" ry="7" fill="#fff6d6" />
        <rect x="38" y="84" width="10" height="26" rx="4" fill="#ff2a2a" />
        <rect x="38" y="130" width="10" height="26" rx="4" fill="#ff2a2a" />
      </g>
    </svg>
  )
}
