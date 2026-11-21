/** Stylised abstract skyline: Shanghai-style tower (left) and Dubai-style spire (right). Decorative only. */
export default function Skyline() {
  return (
    <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] w-full" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f8fe8" stopOpacity=".55" /><stop offset="1" stopColor="#c9d8ff" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id="sk2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8aa6ee" stopOpacity=".38" /><stop offset="1" stopColor="#dfe8ff" stopOpacity=".05" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcd0ff" stopOpacity=".55" /><stop offset="1" stopColor="#eef3ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* back layer */}
      <g fill="url(#sk2)">
        <rect x="40" y="330" width="46" height="130" /><rect x="96" y="290" width="38" height="170" /><rect x="260" y="310" width="52" height="150" />
        <rect x="1140" y="300" width="44" height="160" /><rect x="1210" y="270" width="52" height="190" /><rect x="1330" y="320" width="48" height="140" />
      </g>
      {/* Shanghai-style tower with spheres */}
      <g fill="url(#sk)">
        <rect x="186" y="150" width="6" height="170" /><circle cx="189" cy="296" r="30" /><circle cx="189" cy="200" r="17" />
        <rect x="170" y="320" width="38" height="140" />
        <path d="M130 460V350l26-14 26 14v110zM226 460V330l24-18 24 18v130z" />
        <rect x="320" y="270" width="60" height="190" /><rect x="392" y="330" width="46" height="130" />
      </g>
      {/* Dubai-style spire */}
      <g fill="url(#sk)">
        <path d="M1085 460V260l8-60 6-70 5 70 8 60v200z" /><path d="M1060 460V330h18v130zM1118 460V310h18v150z" />
        <rect x="960" y="280" width="52" height="180" /><rect x="1020" y="340" width="40" height="120" />
        <path d="M1290 460V300l24-30 24 30v160z" /><rect x="880" y="340" width="60" height="120" />
      </g>
      <rect y="455" width="1440" height="65" fill="url(#water)" />
    </svg>
  )
}
