import { motion } from 'framer-motion';

/**
 * Chef Tara — Cooking Thozhan's AI cooking assistant.
 * Premium vector mascot with warm golden skin, expressive eyes, and a
 * friendly smile. She steps into the page from the right with a welcoming
 * gesture while ingredients orbit around her in a softly-lit modern kitchen.
 *
 * All animation wrappers, timing, and behavior are preserved exactly.
 * Only the SVG shapes, gradients, and visual details have been upgraded.
 */

const ORBIT = [
  { id: 'tomato',   cx: 240, cy: 250, r: 150, a: 10,  dur: 18, size: 22, color: '#FF6B4A', leaf: true },
  { id: 'onion',    cx: 240, cy: 250, r: 150, a: 55,  dur: 20, size: 20, color: '#F2C77A' },
  { id: 'carrot',   cx: 240, cy: 250, r: 150, a: 100, dur: 22, size: 18, color: '#FF8C42', veg: 'carrot' },
  { id: 'lemon',    cx: 240, cy: 250, r: 150, a: 145, dur: 19, size: 18, color: '#FFD23F' },
  { id: 'capsicum', cx: 240, cy: 250, r: 150, a: 190, dur: 21, size: 22, color: '#7CB342', veg: 'capsicum' },
  { id: 'mushroom', cx: 240, cy: 250, r: 150, a: 235, dur: 17, size: 18, color: '#D4A574', veg: 'mushroom' },
  { id: 'garlic',   cx: 240, cy: 250, r: 150, a: 280, dur: 23, size: 16, color: '#FBF3E4', veg: 'garlic' },
  { id: 'potato',   cx: 240, cy: 250, r: 150, a: 325, dur: 24, size: 20, color: '#C9A06A' },
];

function Ingredient({ item }: { item: typeof ORBIT[number] }) {
  const x = item.cx + item.r * Math.cos((item.a * Math.PI) / 180);
  const y = item.cy + item.r * Math.sin((item.a * Math.PI) / 180);
  return (
    <motion.g
      style={{ transformOrigin: `${item.cx}px ${item.cy}px` }}
      animate={{ rotate: 360 }}
      transition={{ duration: item.dur, repeat: Infinity, ease: 'linear' }}
    >
      <g transform={`translate(${x} ${y})`}>
        {/* Soft drop shadow under each ingredient */}
        <ellipse cx="0" cy={item.size / 2 + 3} rx={item.size / 2} ry={item.size / 6} fill="#000000" opacity="0.08" />
        {item.veg === 'carrot' && (
          <g>
            <path d="M-6 4 L6 4 L4 14 L-4 14 Z" fill={item.color} />
            <path d="M-6 4 L6 4 L5 6 L-5 6 Z" fill="#E07A30" opacity="0.5" />
            <path d="M-5 2 L5 2 L6 4 L-6 4 Z" fill="#4E8B3A" />
            <path d="M-2 -6 L0 2 L2 -6" stroke="#4E8B3A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M-1 -4 L0 1 L1 -4" stroke="#5FA84A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
          </g>
        )}
        {item.veg === 'capsicum' && (
          <g>
            <path d="M-9 4 Q-9 -6 0 -6 Q9 -6 9 4 Q9 12 0 12 Q-9 12 -9 4 Z" fill={item.color} />
            <path d="M-9 4 Q-9 -6 0 -6 Q9 -6 9 4 Q9 12 0 12 Q-9 12 -9 4 Z" fill="#5A9A2E" opacity="0.25" />
            <path d="M-3 -6 Q0 -12 3 -6" stroke="#3A6B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M0 -6 L0 0" stroke="#3A6B1F" strokeWidth="1.5" opacity="0.5" />
            <ellipse cx="-3" cy="0" rx="2.5" ry="3.5" fill="#9DD45A" opacity="0.5" />
          </g>
        )}
        {item.veg === 'mushroom' && (
          <g>
            <path d="M-10 0 Q-10 -10 0 -10 Q10 -10 10 0 Z" fill={item.color} />
            <path d="M-10 0 Q-10 -10 0 -10 Q10 -10 10 0 Q5 -4 0 -4 Q-5 -4 -10 0 Z" fill="#E0B884" opacity="0.6" />
            <ellipse cx="0" cy="3" rx="6" ry="7" fill="#FBF3E4" />
            <circle cx="-4" cy="-4" r="1.8" fill="#FFF" opacity="0.7" />
            <circle cx="3" cy="-2" r="1.2" fill="#FFF" opacity="0.7" />
            <circle cx="0" cy="-6" r="1" fill="#FFF" opacity="0.6" />
          </g>
        )}
        {item.veg === 'garlic' && (
          <g>
            <path d="M-7 2 Q-7 -8 0 -8 Q7 -8 7 2 Q7 8 0 8 Q-7 8 -7 2 Z" fill={item.color} />
            <path d="M-7 2 Q-7 -8 0 -8 Q7 -8 7 2 Q7 8 0 8 Q-7 8 -7 2 Z" fill="#F0E0C0" opacity="0.3" />
            <path d="M0 -8 L0 8" stroke="#E8D9B8" strokeWidth="1" />
            <path d="M-3 -2 Q0 0 -3 6" stroke="#E8D9B8" strokeWidth="0.8" fill="none" />
            <path d="M3 -2 Q0 0 3 6" stroke="#E8D9B8" strokeWidth="0.8" fill="none" />
          </g>
        )}
        {!item.veg && (
          <g>
            <circle cx="0" cy="0" r={item.size / 2} fill={item.color} />
            <path
              d={`M-${item.size / 2} 0 A${item.size / 2} ${item.size / 2} 0 0 1 ${item.size / 2} 0 Z`}
              fill="#FFFFFF"
              opacity="0.15"
            />
            {item.leaf && (
              <path d="M-2 -8 Q2 -14 6 -8" stroke="#2E7D32" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}
            <ellipse cx={-item.size / 5} cy={-item.size / 5} rx={item.size / 6} ry={item.size / 8} fill="#FFF" opacity="0.45" />
          </g>
        )}
      </g>
    </motion.g>
  );
}

export function ChefTara() {
  return (
    <motion.svg
      viewBox="0 0 400 480"
      className="h-full w-full"
      role="img"
      aria-label="Chef Tara, the Cooking Thozhan AI cooking assistant, stepping into your kitchen"
      initial={{ x: 140, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
    >
      <defs>
        {/* Kitchen ambient */}
        <linearGradient id="kt-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF7EC" />
          <stop offset="55%" stopColor="#FFE9D0" />
          <stop offset="100%" stopColor="#F5D5B0" />
        </linearGradient>
        <radialGradient id="kt-glow" cx="0.35" cy="0.25" r="0.7">
          <stop offset="0%" stopColor="#FFE8B8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFE8B8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="kt-counter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A574" />
          <stop offset="100%" stopColor="#B8895A" />
        </linearGradient>
        {/* Tara — premium skin with warm sunlit glow */}
        <linearGradient id="kt-skin" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#F8DAB0" />
          <stop offset="50%" stopColor="#F0C898" />
          <stop offset="100%" stopColor="#E5B582" />
        </linearGradient>
        <linearGradient id="kt-skin-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E5B582" stopOpacity="0" />
          <stop offset="100%" stopColor="#C99A66" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="kt-sunlit" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#FFF0D8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFF0D8" stopOpacity="0" />
        </radialGradient>
        {/* Hair — dark silky with shine */}
        <linearGradient id="kt-hair" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#3A2418" />
          <stop offset="40%" stopColor="#2A1810" />
          <stop offset="100%" stopColor="#1A0E08" />
        </linearGradient>
        <linearGradient id="kt-hair-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A3A28" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#4A2E1E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2A1810" stopOpacity="0" />
        </linearGradient>
        {/* Chef hat — premium fabric */}
        <linearGradient id="kt-hat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#FBF5EC" />
          <stop offset="100%" stopColor="#F5E8D5" />
        </linearGradient>
        <linearGradient id="kt-hat-fold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#E8D8C0" stopOpacity="0.5" />
        </linearGradient>
        {/* Chef coat — premium fabric */}
        <linearGradient id="kt-coat" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F8F8F8" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </linearGradient>
        <linearGradient id="kt-coat-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#D8D8D8" stopOpacity="0.5" />
        </linearGradient>
        {/* Apron — richer Cooking Thozhan orange */}
        <linearGradient id="kt-apron" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FFA85C" />
          <stop offset="50%" stopColor="#FF8A2A" />
          <stop offset="100%" stopColor="#F5700A" />
        </linearGradient>
        <linearGradient id="kt-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF8C42" />
          <stop offset="100%" stopColor="#E66A1A" />
        </linearGradient>
        <linearGradient id="kt-pants" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A3A3A" />
          <stop offset="100%" stopColor="#2A2A2A" />
        </linearGradient>
        <linearGradient id="kt-shoe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A4A4A" />
          <stop offset="100%" stopColor="#2A2A2A" />
        </linearGradient>
        <radialGradient id="kt-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FF9A6B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF9A6B" stopOpacity="0" />
        </radialGradient>
        {/* Eye — warm brown iris */}
        <radialGradient id="kt-iris" cx="0.4" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#6B4A2E" />
          <stop offset="60%" stopColor="#5A3A22" />
          <stop offset="100%" stopColor="#3A2418" />
        </radialGradient>
        <filter id="kt-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* ===== Kitchen background ===== */}
      <rect x="0" y="0" width="400" height="480" fill="url(#kt-bg)" />
      <rect x="0" y="0" width="400" height="480" fill="url(#kt-glow)" />

      {/* Subtle shelves */}
      <g opacity="0.25">
        <rect x="20" y="70" width="120" height="5" rx="2.5" fill="#B8895A" />
        <rect x="30" y="40" width="18" height="28" rx="3" fill="#FFFFFF" />
        <rect x="54" y="44" width="16" height="24" rx="3" fill="#FFE9D0" />
        <rect x="78" y="38" width="20" height="30" rx="3" fill="#FFFFFF" />
        <rect x="20" y="130" width="100" height="4" rx="2" fill="#B8895A" />
        <rect x="34" y="108" width="10" height="22" rx="2" fill="#C68B5A" />
        <rect x="50" y="104" width="8" height="26" rx="2" fill="#A0683A" />
        <rect x="66" y="110" width="12" height="20" rx="2" fill="#C68B5A" />
      </g>

      {/* Hanging utensils */}
      <g opacity="0.2">
        <line x1="150" y1="20" x2="150" y2="55" stroke="#8A6A4A" strokeWidth="1.5" />
        <rect x="146" y="55" width="8" height="22" rx="2" fill="#C0C0C0" />
        <line x1="172" y1="20" x2="172" y2="50" stroke="#8A6A4A" strokeWidth="1.5" />
        <ellipse cx="172" cy="56" rx="9" ry="5" fill="#D4A574" />
        <line x1="194" y1="20" x2="194" y2="58" stroke="#8A6A4A" strokeWidth="1.5" />
        <path d="M188 58 L200 58 L197 70 L191 70 Z" fill="#C0C0C0" />
      </g>

      {/* Wooden countertop */}
      <rect x="0" y="400" width="400" height="80" fill="url(#kt-counter)" />
      <rect x="0" y="400" width="400" height="6" fill="#A07850" opacity="0.5" />
      <g opacity="0.2">
        <line x1="60" y1="420" x2="60" y2="475" stroke="#8A6A4A" strokeWidth="1" />
        <line x1="180" y1="410" x2="180" y2="470" stroke="#8A6A4A" strokeWidth="1" />
        <line x1="300" y1="415" x2="300" y2="475" stroke="#8A6A4A" strokeWidth="1" />
      </g>

      {/* Soft floor shadow under Tara */}
      <ellipse cx="250" cy="408" rx="80" ry="12" fill="#000000" opacity="0.12" />

      {/* ===== Orbiting ingredients (behind Tara) ===== */}
      {ORBIT.slice(0, 4).map((item) => (
        <Ingredient key={item.id} item={item} />
      ))}

      {/* ===== Tara — whole body breathing bob ===== */}
      <motion.g
        animate={{ y: [0, -3.5, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Back leg (standing) */}
        <path d="M225 340 L222 400 L240 400 L242 340 Z" fill="url(#kt-pants)" />
        <ellipse cx="231" cy="404" rx="16" ry="8" fill="url(#kt-shoe)" />

        {/* Front leg (stepping forward) */}
        <motion.g
          animate={{ rotate: [0, -4, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '270px 340px' }}
        >
          <path d="M268 340 L276 398 L294 396 L286 338 Z" fill="url(#kt-pants)" />
          <ellipse cx="285" cy="402" rx="17" ry="8" fill="url(#kt-shoe)" />
          <ellipse cx="282" cy="400" rx="6" ry="3" fill="#FFFFFF" opacity="0.15" />
        </motion.g>

        {/* Torso / chef coat */}
        <path
          d="M196 250 Q196 220 215 215 L285 215 Q304 220 304 250 L308 345 Q308 352 300 352 L200 352 Q192 352 192 345 Z"
          fill="url(#kt-coat)"
        />
        {/* Coat side shading */}
        <path
          d="M268 215 Q304 220 304 250 L308 345 Q308 352 300 352 L278 352 Z"
          fill="url(#kt-coat-shade)"
          opacity="0.5"
        />
        {/* Coat fabric folds */}
        <path d="M210 260 Q214 300 210 345" stroke="#E0E0E0" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M292 260 Q288 300 292 345" stroke="#E0E0E0" strokeWidth="1" fill="none" opacity="0.4" />
        {/* Coat button line */}
        <line x1="250" y1="250" x2="250" y2="345" stroke="#E0E0E0" strokeWidth="1.5" />
        <circle cx="250" cy="270" r="2.5" fill="#D0D0D0" />
        <circle cx="250" cy="300" r="2.5" fill="#D0D0D0" />
        <circle cx="250" cy="330" r="2.5" fill="#D0D0D0" />
        {/* Button highlights */}
        <circle cx="249.5" cy="269.5" r="0.8" fill="#FFFFFF" opacity="0.6" />
        <circle cx="249.5" cy="299.5" r="0.8" fill="#FFFFFF" opacity="0.6" />
        <circle cx="249.5" cy="329.5" r="0.8" fill="#FFFFFF" opacity="0.6" />

        {/* Collar V */}
        <path d="M224 215 L250 248 L276 215 Z" fill="url(#kt-band)" />
        {/* Collar stitching */}
        <path d="M226 217 L250 246 L274 217" stroke="#FFB070" strokeWidth="0.8" fill="none" opacity="0.5" />

        {/* Apron straps */}
        <path d="M232 248 L240 268 L248 248 Z" fill="url(#kt-apron)" opacity="0.9" />
        <path d="M252 248 L260 268 L268 248 Z" fill="url(#kt-apron)" opacity="0.9" />
        {/* Apron band */}
        <rect x="222" y="266" width="60" height="10" rx="5" fill="url(#kt-band)" />
        {/* Apron body */}
        <path d="M228 276 L276 276 L282 348 L222 348 Z" fill="url(#kt-apron)" opacity="0.92" />
        {/* Apron fabric fold */}
        <path d="M250 276 L250 348" stroke="#E66A1A" strokeWidth="0.8" opacity="0.3" />
        {/* Apron pocket */}
        <rect x="240" y="296" width="22" height="16" rx="3" fill="none" stroke="#E66A1A" strokeWidth="1.5" opacity="0.6" />
        {/* Embroidered Cooking Thozhan emblem on pocket */}
        <g opacity="0.7">
          <circle cx="251" cy="304" r="3.5" fill="none" stroke="#FFE0C0" strokeWidth="0.8" />
          <path d="M249 303 Q251 306 253 303" stroke="#FFE0C0" strokeWidth="0.7" fill="none" strokeLinecap="round" />
          <circle cx="251" cy="302" r="0.8" fill="#FFE0C0" />
        </g>
        {/* Apron tie bow */}
        <ellipse cx="252" cy="271" rx="5" ry="3.5" fill="#E66A1A" />
        <path d="M248 269 L244 266 L244 274 Z" fill="#E66A1A" />
        <path d="M256 269 L260 266 L260 274 Z" fill="#E66A1A" />

        {/* Neck */}
        <rect x="240" y="195" width="20" height="26" rx="10" fill="url(#kt-skin)" />
        <rect x="240" y="195" width="20" height="26" rx="10" fill="url(#kt-skin-shade)" />
        {/* Neck shadow under chin */}
        <ellipse cx="250" cy="200" rx="11" ry="3" fill="#D4A578" opacity="0.25" />

        {/* ===== Head group (slight head movement) ===== */}
        <motion.g
          animate={{ rotate: [0, -2, 0, 1.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '250px 165px' }}
        >
          {/* Hair back (shoulder-length, silky with volume) */}
          <path
            d="M194 150 Q194 92 250 86 Q306 92 306 150 L306 208 Q306 218 292 218 L208 218 Q194 218 194 206 Z"
            fill="url(#kt-hair)"
          />
          {/* Hair shine highlight */}
          <path
            d="M210 100 Q250 92 290 100 L286 130 Q250 122 214 130 Z"
            fill="url(#kt-hair-shine)"
            opacity="0.5"
          />
          {/* Hair wave texture */}
          <path d="M200 180 Q210 195 200 210" stroke="#2A1810" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M300 180 Q290 195 300 210" stroke="#2A1810" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M205 165 Q215 175 208 190" stroke="#2A1810" strokeWidth="1.5" fill="none" opacity="0.5" />
          <path d="M295 165 Q285 175 292 190" stroke="#2A1810" strokeWidth="1.5" fill="none" opacity="0.5" />
          {/* Soft hair strands */}
          <path d="M220 95 Q230 110 222 140" stroke="#4A2E1E" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M280 95 Q270 110 278 140" stroke="#4A2E1E" strokeWidth="1" fill="none" opacity="0.3" />

          {/* Face — softer oval with smooth jawline */}
          <path
            d="M208 155 Q208 108 250 105 Q292 108 292 155 Q292 195 270 205 Q260 210 250 210 Q240 210 230 205 Q208 195 208 155 Z"
            fill="url(#kt-skin)"
          />
          {/* Face sunlit glow */}
          <path
            d="M208 155 Q208 108 250 105 Q292 108 292 155 Q292 195 270 205 Q260 210 250 210 Q240 210 230 205 Q208 195 208 155 Z"
            fill="url(#kt-sunlit)"
          />
          {/* Face side shading */}
          <path
            d="M270 130 Q290 145 290 185 Q285 200 270 205 Q260 210 250 210 L250 105 Q280 108 292 155 Q292 175 285 190 Z"
            fill="url(#kt-skin-shade)"
            opacity="0.5"
          />
          {/* Rounded cheeks */}
          <ellipse cx="222" cy="172" rx="12" ry="9" fill="url(#kt-skin)" opacity="0.5" />
          <ellipse cx="278" cy="172" rx="12" ry="9" fill="url(#kt-skin)" opacity="0.5" />

          {/* Hair fringe / front bangs — natural flow */}
          <path
            d="M206 138 Q210 100 250 96 Q290 100 294 138 Q288 118 270 116 Q262 128 250 124 Q238 128 230 116 Q212 118 206 138 Z"
            fill="url(#kt-hair)"
          />
          {/* Fringe shine */}
          <path d="M220 104 Q250 98 280 104 L278 114 Q250 108 222 114 Z" fill="url(#kt-hair-shine)" opacity="0.4" />
          {/* Side bangs */}
          <path d="M206 145 Q198 178 212 198 Q204 178 208 155 Z" fill="url(#kt-hair)" />
          <path d="M294 145 Q302 178 288 198 Q296 178 292 155 Z" fill="url(#kt-hair)" />

          {/* Chef hat */}
          <motion.g
            animate={{ y: [0, -1.5, 0], rotate: [0, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '250px 92px' }}
          >
            <path
              d="M200 112 Q198 58 224 54 Q230 34 250 34 Q270 34 276 54 Q302 58 300 112 Z"
              fill="url(#kt-hat)"
            />
            {/* Hat fabric folds */}
            <path d="M214 112 Q212 70 224 56" stroke="url(#kt-hat-fold)" strokeWidth="2" fill="none" />
            <path d="M250 112 L250 38" stroke="url(#kt-hat-fold)" strokeWidth="1.5" fill="none" />
            <path d="M286 112 Q288 70 276 56" stroke="url(#kt-hat-fold)" strokeWidth="2" fill="none" />
            {/* Soft hat shadow under band */}
            <rect x="200" y="104" width="100" height="3" fill="#E8D8C0" opacity="0.4" />
            {/* Hat band */}
            <rect x="200" y="104" width="100" height="12" rx="6" fill="url(#kt-band)" />
            {/* Hat band stitching */}
            <line x1="202" y1="110" x2="298" y2="110" stroke="#FFB070" strokeWidth="0.6" opacity="0.5" />
            {/* Hat puffs */}
            <ellipse cx="226" cy="68" rx="16" ry="14" fill="#FFFFFF" opacity="0.7" />
            <ellipse cx="274" cy="68" rx="16" ry="14" fill="#FFFFFF" opacity="0.7" />
            <ellipse cx="250" cy="54" rx="14" ry="12" fill="#FFFFFF" opacity="0.5" />
            {/* Hat puff highlights */}
            <ellipse cx="222" cy="64" rx="6" ry="4" fill="#FFFFFF" opacity="0.6" />
            <ellipse cx="270" cy="64" rx="6" ry="4" fill="#FFFFFF" opacity="0.6" />
          </motion.g>

          {/* Eyebrows — softer natural curves */}
          <path d="M224 138 Q234 133 244 138" stroke="#3A2418" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M256 138 Q266 133 276 138" stroke="#3A2418" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          {/* Eyebrow softness */}
          <path d="M226 139 Q234 136 242 139" stroke="#5A3A28" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
          <path d="M258 139 Q266 136 274 139" stroke="#5A3A28" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />

          {/* Eyes — larger, expressive, warm brown */}
          {/* Eye whites */}
          <ellipse cx="234" cy="152" rx="6.5" ry="8" fill="#FFFFFF" />
          <ellipse cx="266" cy="152" rx="6.5" ry="8" fill="#FFFFFF" />
          {/* Upper eyelid shadow */}
          <path d="M228 146 Q234 144 240 146 L240 150 Q234 148 228 150 Z" fill="#E8D0C0" opacity="0.4" />
          <path d="M260 146 Q266 144 272 146 L272 150 Q266 148 260 150 Z" fill="#E8D0C0" opacity="0.4" />

          {/* Iris — warm brown, blink animation */}
          <motion.ellipse
            cx="234" cy="153" rx="5" ry="6.5" fill="url(#kt-iris)"
            animate={{ ry: [6.5, 6.5, 0.8, 6.5, 6.5] }}
            transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.42, 0.47, 0.52, 1] }}
          />
          <motion.ellipse
            cx="266" cy="153" rx="5" ry="6.5" fill="url(#kt-iris)"
            animate={{ ry: [6.5, 6.5, 0.8, 6.5, 6.5] }}
            transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.42, 0.47, 0.52, 1] }}
          />
          {/* Pupil */}
          <motion.circle
            cx="234" cy="153" r="2.5" fill="#1A0E08"
            animate={{ r: [2.5, 2.5, 0.3, 2.5, 2.5] }}
            transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.42, 0.47, 0.52, 1] }}
          />
          <motion.circle
            cx="266" cy="153" r="2.5" fill="#1A0E08"
            animate={{ r: [2.5, 2.5, 0.3, 2.5, 2.5] }}
            transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.42, 0.47, 0.52, 1] }}
          />
          {/* Eye highlights — sparkle */}
          <circle cx="236" cy="150" r="1.8" fill="#FFFFFF" />
          <circle cx="268" cy="150" r="1.8" fill="#FFFFFF" />
          <circle cx="232" cy="155" r="0.8" fill="#FFFFFF" opacity="0.7" />
          <circle cx="264" cy="155" r="0.8" fill="#FFFFFF" opacity="0.7" />

          {/* Eyelashes — soft and natural */}
          <path d="M228 146 L225 142" stroke="#3A2418" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M231 145 L229 141" stroke="#3A2418" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M272 146 L275 142" stroke="#3A2418" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M269 145 L271 141" stroke="#3A2418" strokeWidth="1.4" strokeLinecap="round" />
          {/* Lower lash line */}
          <path d="M229 159 Q234 161 239 159" stroke="#3A2418" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
          <path d="M261 159 Q266 161 271 159" stroke="#3A2418" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />

          {/* Blush — subtle natural */}
          <ellipse cx="220" cy="170" rx="10" ry="6.5" fill="url(#kt-cheek)" />
          <ellipse cx="280" cy="170" rx="10" ry="6.5" fill="url(#kt-cheek)" />

          {/* Nose — soft and natural */}
          <path d="M250 160 Q247 170 249 175 Q250 177 251 175 Q253 170 250 160" stroke="#D4A578" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="248" cy="174" rx="1" ry="0.8" fill="#D4A578" opacity="0.3" />
          <ellipse cx="252" cy="174" rx="1" ry="0.8" fill="#D4A578" opacity="0.3" />

          {/* Smile — genuine, soft curved lips */}
          <path d="M232 182 Q250 198 268 182" stroke="#C0563A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M236 184 Q250 194 264 184" stroke="#E8845C" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
          {/* Lip highlight */}
          <path d="M238 181 Q250 186 262 181" stroke="#FFB088" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
          {/* Subtle lower lip */}
          <path d="M238 187 Q250 191 262 187" stroke="#D0604A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4" />

          {/* Earrings */}
          <circle cx="208" cy="162" r="3" fill="#FF8C42" />
          <circle cx="292" cy="162" r="3" fill="#FF8C42" />
          <circle cx="207.5" cy="161.5" r="1" fill="#FFD8A8" opacity="0.7" />
          <circle cx="291.5" cy="161.5" r="1" fill="#FFD8A8" opacity="0.7" />
        </motion.g>

        {/* ===== Left arm (welcoming gesture, raised forward) ===== */}
        <motion.g
          animate={{ rotate: [0, -12, 0, -6, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.4, 0.6, 1] }}
          style={{ transformOrigin: '200px 255px' }}
        >
          <path d="M200 255 Q172 240 160 210 L174 204 Q186 232 212 250 Z" fill="url(#kt-coat)" />
          <path d="M200 255 Q172 240 160 210 L174 204 Q186 232 212 250 Z" fill="url(#kt-coat-shade)" opacity="0.4" />
          {/* Coat cuff */}
          <ellipse cx="166" cy="206" rx="9" ry="5" fill="url(#kt-band)" transform="rotate(-20 166 206)" />
          {/* Hand (open welcoming) — softer palm shape */}
          <ellipse cx="162" cy="200" rx="12" ry="11" fill="url(#kt-skin)" />
          <ellipse cx="162" cy="200" rx="12" ry="11" fill="url(#kt-skin-shade)" opacity="0.3" />
          {/* Fingers — natural curves */}
          <path d="M154 190 Q156 184 160 186 L160 192 Q156 194 154 192 Z" fill="url(#kt-skin)" />
          <path d="M160 187 Q162 181 166 183 L166 189 Q162 191 160 189 Z" fill="url(#kt-skin)" />
          <path d="M167 189 Q171 185 173 189 L171 193 Q168 193 167 191 Z" fill="url(#kt-skin)" />
          {/* Finger detail lines */}
          <path d="M156 192 Q158 196 156 200" stroke="#D4A578" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4" />
          <path d="M162 190 Q164 194 162 198" stroke="#D4A578" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4" />
          <path d="M168 192 Q170 196 168 200" stroke="#D4A578" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4" />
        </motion.g>

        {/* ===== Right arm (at side, holding) ===== */}
        <motion.g
          animate={{ rotate: [0, 6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '300px 255px' }}
        >
          <path d="M300 255 Q318 275 312 312 L298 310 Q302 280 288 258 Z" fill="url(#kt-coat)" />
          <path d="M300 255 Q318 275 312 312 L298 310 Q302 280 288 258 Z" fill="url(#kt-coat-shade)" opacity="0.4" />
          {/* Coat cuff */}
          <ellipse cx="305" cy="310" rx="9" ry="5" fill="url(#kt-band)" />
          {/* Hand — softer palm */}
          <ellipse cx="305" cy="316" rx="11" ry="10" fill="url(#kt-skin)" />
          <ellipse cx="305" cy="316" rx="11" ry="10" fill="url(#kt-skin-shade)" opacity="0.3" />
          {/* Finger detail */}
          <path d="M300 312 Q302 308 306 310" stroke="#D4A578" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
        </motion.g>
      </motion.g>

      {/* ===== Orbiting ingredients (front layer) ===== */}
      {ORBIT.slice(4).map((item) => (
        <Ingredient key={item.id} item={item} />
      ))}

      {/* Extra small floating accents */}
      <motion.g
        animate={{ y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <circle cx="120" cy="280" r="3" fill="#FFD23F" opacity="0.6" />
        <circle cx="140" cy="320" r="2" fill="#FF8C42" opacity="0.5" />
      </motion.g>

      {/* Rim light highlight on Tara's edge */}
      <path
        d="M304 150 Q308 200 308 345"
        stroke="#FFE8B8"
        strokeWidth="3"
        fill="none"
        opacity="0.4"
        filter="url(#kt-soft)"
      />
    </motion.svg>
  );
}
