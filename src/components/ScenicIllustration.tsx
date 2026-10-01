interface ScenicIllustrationProps {
  type: 'islands' | 'mountains' | 'temple' | 'caldera' | 'savanna' | 'bamboo' | 'angkor' | 'halong' | 'bhutan' | 'hero';
  className?: string;
}

export function ScenicIllustration({ type, className = '' }: ScenicIllustrationProps) {
  if (type === 'hero') {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {/* Layered atmospheric sky & mountains */}
        <svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="hero-sky" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#081b29" />
              <stop offset="40%" stopColor="#0e2a47" />
              <stop offset="75%" stopColor="#1a3b5c" />
              <stop offset="100%" stopColor="#2c223b" />
            </linearGradient>
            <radialGradient id="sun-glow" cx="65%" cy="35%" r="45%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="mtn-distant" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="mtn-mid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>
            <linearGradient id="water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#0e7490" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#083344" />
            </linearGradient>
          </defs>

          {/* Sky background */}
          <rect width="1440" height="900" fill="url(#hero-sky)" />
          {/* Golden dusk halo */}
          <circle cx="950" cy="320" r="380" fill="url(#sun-glow)" />

          {/* Distant mountain silhouette */}
          <path
            d="M0 640 L180 520 L360 590 L560 460 L780 540 L1020 420 L1220 510 L1440 450 L1440 900 L0 900 Z"
            fill="url(#mtn-distant)"
          />

          {/* Midground dramatic coastal peaks */}
          <path
            d="M0 720 L140 610 L310 680 L520 540 L700 640 L910 510 L1150 630 L1340 560 L1440 600 L1440 900 L0 900 Z"
            fill="url(#mtn-mid)"
          />

          {/* Water Lagoon with subtle reflections */}
          <path
            d="M0 760 Q360 740 720 755 T1440 750 L1440 900 L0 900 Z"
            fill="url(#water-grad)"
          />

          {/* Water reflection ripples */}
          <path d="M780 770 L1120 770" stroke="#fef08a" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
          <path d="M840 782 L1060 782" stroke="#fef08a" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
          <path d="M890 796 L1010 796" stroke="#fef08a" strokeWidth="1.5" strokeOpacity="0.25" strokeLinecap="round" />

          {/* Foreground tropical island outcrop */}
          <path
            d="M1100 900 C1120 810 1190 790 1260 820 C1320 800 1390 840 1440 880 L1440 900 Z"
            fill="#030712"
          />
          {/* Palm tree silhouettes */}
          <path
            d="M1280 820 Q1270 740 1250 680"
            stroke="#030712"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M1250 680 Q1220 660 1190 670 M1250 680 Q1230 640 1200 635 M1250 680 Q1270 640 1290 635 M1250 680 Q1280 660 1310 670 M1250 680 Q1260 690 1270 710"
            stroke="#030712"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Subtle star particle specs */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />
      </div>
    );
  }

  if (type === 'islands') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-cyan-900 to-teal-950 ${className}`}>
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="lagoon-sun" cx="50%" cy="30%" r="40%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="#082f49" />
          <circle cx="200" cy="90" r="120" fill="url(#lagoon-sun)" />
          {/* Distant Atoll Ring */}
          <path d="M0 160 Q100 155 200 158 T400 160 L400 300 L0 300 Z" fill="#0f766e" fillOpacity="0.4" />
          {/* Turquoise Lagoon */}
          <path d="M0 180 Q200 170 400 180 L400 300 L0 300 Z" fill="#0d9488" fillOpacity="0.8" />
          {/* Overwater Bungalow Silhouette & Jetty */}
          <path d="M120 220 L280 220 M160 220 L160 200 L240 200 L240 220 M150 200 L200 175 L250 200 Z" stroke="#042f2e" strokeWidth="3" fill="#042f2e" />
          <path d="M200 220 L200 270 L190 280 M200 250 L215 260" stroke="#042f2e" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (type === 'mountains') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 ${className}`}>
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="snow-cap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="#0f172a" />
          {/* Alpine Peak Back */}
          <polygon points="200,40 310,210 90,210" fill="#1e293b" />
          {/* Snow cap */}
          <polygon points="200,40 235,95 210,90 190,105 165,95" fill="url(#snow-cap)" />
          {/* Side ridge */}
          <polygon points="200,40 270,180 200,210" fill="#334155" fillOpacity="0.4" />
          {/* Alpine Forehills with Pines */}
          <path d="M0 200 Q150 180 300 210 T400 200 L400 300 L0 300 Z" fill="#090d16" />
          {/* Pine Trees */}
          <path d="M60 220 L70 200 L80 220 Z M65 220 L65 230" fill="#1e293b" stroke="#1e293b" />
          <path d="M85 215 L95 190 L105 215 Z M95 215 L95 225" fill="#1e293b" stroke="#1e293b" />
          <path d="M320 225 L330 195 L340 225 Z M330 225 L330 235" fill="#1e293b" stroke="#1e293b" />
        </svg>
      </div>
    );
  }

  if (type === 'temple') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-emerald-950 to-stone-950 ${className}`}>
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <rect width="400" height="300" fill="#064e3b" fillOpacity="0.5" />
          {/* Misty Jungle Horizon */}
          <circle cx="200" cy="110" r="70" fill="#10b981" fillOpacity="0.15" />
          {/* Candi Bentar (Balinese Split Gate) */}
          {/* Left Wing */}
          <path d="M150 190 L150 100 L165 90 L165 190 Z" fill="#1c1917" />
          <path d="M135 140 L165 130 L165 150 L135 155 Z" fill="#1c1917" />
          <path d="M125 170 L165 160 L165 180 L125 185 Z" fill="#1c1917" />
          {/* Right Wing */}
          <path d="M250 190 L250 100 L235 90 L235 190 Z" fill="#1c1917" />
          <path d="M265 140 L235 130 L235 150 L265 155 Z" fill="#1c1917" />
          <path d="M275 170 L235 160 L235 180 L275 185 Z" fill="#1c1917" />
          {/* Tiered Rice Terraces below */}
          <path d="M0 210 Q200 200 400 210 L400 300 L0 300 Z" fill="#047857" fillOpacity="0.5" />
          <path d="M0 240 Q180 230 400 245 L400 300 L0 300 Z" fill="#065f46" fillOpacity="0.7" />
          <path d="M0 270 Q220 260 400 275 L400 300 L0 300 Z" fill="#064e3b" />
        </svg>
      </div>
    );
  }

  if (type === 'caldera') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-blue-950 to-indigo-950 ${className}`}>
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <rect width="400" height="300" fill="#1e1b4b" fillOpacity="0.8" />
          {/* Sunset glow over Aegean */}
          <circle cx="280" cy="110" r="60" fill="#f59e0b" fillOpacity="0.35" />
          <path d="M0 160 Q200 155 400 160 L400 300 L0 300 Z" fill="#1e3a8a" fillOpacity="0.8" />
          {/* Volcanic Cliff */}
          <path d="M0 140 L160 170 L190 300 L0 300 Z" fill="#1e293b" />
          {/* Whitewashed buildings & blue dome */}
          <rect x="50" y="150" width="40" height="35" fill="#f8fafc" />
          <rect x="85" y="160" width="35" height="30" fill="#f1f5f9" />
          {/* Blue Dome */}
          <path d="M55 150 Q70 135 85 150 Z" fill="#2563eb" />
          <rect x="68" y="132" width="4" height="6" fill="#f8fafc" />
          <line x1="70" y1="130" x2="70" y2="124" stroke="#f8fafc" strokeWidth="1.5" />
          <line x1="67" y1="127" x2="73" y2="127" stroke="#f8fafc" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  if (type === 'savanna') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-amber-950 to-stone-950 ${className}`}>
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <rect width="400" height="300" fill="#451a03" fillOpacity="0.7" />
          {/* Giant Orange Sun */}
          <circle cx="200" cy="120" r="55" fill="#ea580c" fillOpacity="0.75" />
          {/* Savanna Plains */}
          <path d="M0 190 Q200 185 400 190 L400 300 L0 300 Z" fill="#1c1917" />
          {/* Flat-topped Acacia tree silhouette */}
          <path d="M120 220 Q122 170 120 150 M120 165 Q105 140 80 135 M120 160 Q135 145 160 140 M120 150 Q110 130 95 125" stroke="#0c0a09" strokeWidth="4" strokeLinecap="round" />
          {/* Acacia canopy */}
          <ellipse cx="85" cy="130" rx="35" ry="8" fill="#0c0a09" />
          <ellipse cx="140" cy="135" rx="30" ry="7" fill="#0c0a09" />
          <ellipse cx="110" cy="120" rx="40" ry="9" fill="#0c0a09" />
        </svg>
      </div>
    );
  }

  if (type === 'angkor') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-amber-950 via-stone-900 to-stone-950 ${className}`}>
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <rect width="400" height="300" fill="#291a0f" fillOpacity="0.8" />
          {/* Dawn sun behind Angkor Wat lotus towers */}
          <circle cx="200" cy="115" r="50" fill="#f59e0b" fillOpacity="0.5" />
          {/* Angkor Wat Iconic Five Lotus Towers Silhouette */}
          {/* Central Lotus Tower */}
          <path d="M190 190 Q190 110 200 80 Q210 110 210 190 Z" fill="#0c0a09" />
          {/* Inner Left Tower */}
          <path d="M165 190 Q165 130 172 105 Q180 130 180 190 Z" fill="#0c0a09" />
          {/* Inner Right Tower */}
          <path d="M220 190 Q220 130 228 105 Q235 130 235 190 Z" fill="#0c0a09" />
          {/* Outer Left Tower */}
          <path d="M140 190 Q140 145 146 125 Q152 145 152 190 Z" fill="#0c0a09" />
          {/* Outer Right Tower */}
          <path d="M248 190 Q248 145 254 125 Q260 145 260 190 Z" fill="#0c0a09" />
          {/* Gallery Bas-Relief Base */}
          <rect x="120" y="185" width="160" height="25" fill="#0c0a09" />
          {/* Moat Reflection Water */}
          <path d="M0 210 Q200 200 400 210 L400 300 L0 300 Z" fill="#181514" />
          <path d="M150 225 L250 225" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
          <path d="M170 235 L230 235" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (type === 'halong') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-teal-950 via-slate-900 to-stone-950 ${className}`}>
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <rect width="400" height="300" fill="#042f2e" fillOpacity="0.6" />
          <circle cx="270" cy="90" r="45" fill="#14b8a6" fillOpacity="0.25" />
          {/* Distant Karst Peaks */}
          <path d="M60 180 Q80 100 100 180 Z" fill="#0f172a" fillOpacity="0.5" />
          <path d="M120 180 Q145 80 170 180 Z" fill="#0f172a" fillOpacity="0.6" />
          <path d="M260 180 Q290 90 320 180 Z" fill="#0f172a" fillOpacity="0.5" />
          {/* Prominent Limestone Island Towers */}
          <path d="M180 200 Q205 110 230 200 Z" fill="#064e3b" />
          <path d="M290 205 Q315 130 340 205 Z" fill="#064e3b" />
          <path d="M20 210 Q50 120 80 210 Z" fill="#064e3b" />
          {/* Emerald Jade Waters */}
          <path d="M0 190 Q200 185 400 190 L400 300 L0 300 Z" fill="#0d9488" fillOpacity="0.4" />
          {/* Traditional Wooden Junk Sailboat Silhouette */}
          <path d="M130 215 L170 215 L165 225 L135 225 Z" fill="#022c22" />
          {/* Bat-wing Fan Sails */}
          <path d="M142 215 L142 175 Q155 185 142 215 Z" fill="#0f766e" />
          <path d="M152 215 L152 165 Q168 180 152 215 Z" fill="#0f766e" />
        </svg>
      </div>
    );
  }

  if (type === 'bhutan') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-stone-900 via-amber-950/40 to-stone-950 ${className}`}>
        <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <rect width="400" height="300" fill="#1c1917" />
          <circle cx="200" cy="80" r="40" fill="#f59e0b" fillOpacity="0.3" />
          {/* Himalayan Snow-Capped Ridge in Background */}
          <polygon points="120,40 180,120 60,120" fill="#334155" />
          <polygon points="120,40 145,75 130,70 120,80 100,75" fill="#f8fafc" />
          <polygon points="280,50 340,130 220,130" fill="#334155" />
          <polygon points="280,50 305,80 290,75 280,85 265,80" fill="#f8fafc" />
          {/* Sheer Cliff Face (Paro Taktsang / Tiger's Nest) */}
          <path d="M180 90 L270 140 L280 300 L160 300 Z" fill="#0c0a09" />
          {/* Monastery Clinging to Cliff Face */}
          <rect x="210" y="145" width="40" height="25" fill="#f8fafc" />
          {/* Golden Pagoda Roofs */}
          <polygon points="230,135 205,145 255,145" fill="#f59e0b" />
          <rect x="220" y="165" width="20" height="15" fill="#b91c1c" />
          <polygon points="230,160 215,165 245,165" fill="#f59e0b" />
          {/* Prayer Flags spanning across mist */}
          <path d="M100 120 Q160 140 220 135" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M80 135 Q150 155 210 150" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
          {/* Pine trees on ridge */}
          <path d="M60 210 L70 190 L80 210 Z" fill="#1c1917" />
          <path d="M90 205 L100 180 L110 205 Z" fill="#1c1917" />
        </svg>
      </div>
    );
  }

  // Bamboo / Kyoto
  return (
    <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-stone-900 to-stone-950 ${className}`}>
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
        <rect width="400" height="300" fill="#292524" fillOpacity="0.8" />
        <circle cx="160" cy="90" r="50" fill="#f43f5e" fillOpacity="0.2" />
        {/* Pagoda Silhouette */}
        <polygon points="280,100 250,115 310,115" fill="#0c0a09" />
        <rect x="270" y="115" width="20" height="15" fill="#0c0a09" />
        <polygon points="280,130 240,145 320,145" fill="#0c0a09" />
        <rect x="265" y="145" width="30" height="20" fill="#0c0a09" />
        <polygon points="280,165 230,180 330,180" fill="#0c0a09" />
        <rect x="260" y="180" width="40" height="30" fill="#0c0a09" />
        {/* Bamboo stalks in foreground */}
        <line x1="60" y1="40" x2="60" y2="300" stroke="#44403c" strokeWidth="4" />
        <line x1="90" y1="20" x2="90" y2="300" stroke="#57534e" strokeWidth="5" />
        <line x1="130" y1="50" x2="130" y2="300" stroke="#44403c" strokeWidth="4" />
        {/* Ground */}
        <path d="M0 210 Q200 205 400 210 L400 300 L0 300 Z" fill="#0c0a09" />
      </svg>
    </div>
  );
}
