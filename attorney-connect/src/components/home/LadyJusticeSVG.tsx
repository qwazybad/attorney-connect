"use client";

export default function LadyJusticeSVG() {
  return (
    <div
      className="absolute right-0 top-0 h-full w-[50%] pointer-events-none hidden lg:flex items-center justify-center"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 35%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 35%)",
      }}
    >
      <svg
        viewBox="-20 10 400 670"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[85%] w-auto"
        aria-hidden="true"
      >
        {/* Ambient glow */}
        <ellipse cx="190" cy="360" rx="135" ry="295" fill="rgba(255,255,255,0.01)" />

        {/* === FLOATING FIGURE === */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-12; 0,0"
            dur="6s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.37 0 0.63 1;0.37 0 0.63 1"
          />

          {/* Crown */}
          <path
            d="M163 63 L168 45 L176 58 L184 37 L192 54 L200 32 L208 54 L216 37 L224 58 L232 45 L237 63"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="rgba(255,255,255,0.07)"
          />

          {/* Head */}
          <circle
            cx="200" cy="93" r="34"
            fill="rgba(255,255,255,0.09)"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1.2"
          />

          {/* Blindfold */}
          <rect
            x="166" y="85" width="68" height="14" rx="3.5"
            fill="rgba(255,255,255,0.24)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
          />
          <line x1="166" y1="92" x2="151" y2="90" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="234" y1="92" x2="249" y2="90" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Neck */}
          <rect
            x="193" y="127" width="14" height="24" rx="2"
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
          />

          {/* Shoulders */}
          <path
            d="M130 163 C150 149 174 144 200 144 C226 144 250 149 270 163"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Torso */}
          <path
            d="M130 163 L163 293 L237 293 L270 163 C250 149 226 144 200 144 C174 144 150 149 130 163 Z"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.2"
          />
          <path d="M184 153 C179 201 175 249 171 287" stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
          <path d="M200 146 L200 291" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          <path d="M216 153 C221 201 225 249 229 287" stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />

          {/* Lower Robes */}
          <path
            d="M163 293 C129 383 91 479 97 665 L303 665 C309 479 271 383 237 293 Z"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.2"
          />
          <path d="M181 293 C169 386 153 476 149 583" stroke="rgba(255,255,255,0.055)" strokeWidth="1" fill="none" />
          <path d="M200 293 C198 395 196 481 195 583" stroke="rgba(255,255,255,0.055)" strokeWidth="1" fill="none" />
          <path d="M219 293 C231 386 245 476 251 583" stroke="rgba(255,255,255,0.055)" strokeWidth="1" fill="none" />
          <path
            d="M97 665 C121 652 161 646 200 646 C239 646 279 652 303 665"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
            fill="none"
          />

          {/* Base shadow */}
          <ellipse cx="200" cy="667" rx="62" ry="6" fill="rgba(255,255,255,0.03)" />

          {/* Left arm */}
          <path
            d="M130 169 Q90 175 51 183"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />

          {/* Chain from hand to scale pivot */}
          <line x1="51" y1="180" x2="51" y2="186" stroke="rgba(255,255,255,0.38)" strokeWidth="1.2" />

          {/* === SCALES (rotate around 51, 186) === */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-15,51,186; 15,51,186; -15,51,186"
              dur="4.5s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.37 0 0.63 1;0.37 0 0.63 1"
            />

            {/* Beam */}
            <line x1="6" y1="186" x2="96" y2="186" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Pivot knob */}
            <circle cx="51" cy="186" r="3.5" fill="rgba(255,255,255,0.6)" />

            {/* Left chain */}
            <line x1="6" y1="186" x2="6" y2="228" stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" />
            {/* Right chain */}
            <line x1="96" y1="186" x2="96" y2="228" stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" />

            {/* Left pan */}
            <path d="M -8 228 Q 6 239 20 228" stroke="rgba(255,255,255,0.52)" strokeWidth="2" fill="rgba(255,255,255,0.07)" strokeLinecap="round" />
            <line x1="-8" y1="228" x2="20" y2="228" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />

            {/* Right pan */}
            <path d="M 82 228 Q 96 239 110 228" stroke="rgba(255,255,255,0.52)" strokeWidth="2" fill="rgba(255,255,255,0.07)" strokeLinecap="round" />
            <line x1="82" y1="228" x2="110" y2="228" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
          </g>

          {/* Right arm */}
          <path
            d="M270 169 Q286 230 301 302"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />

          {/* === SWORD === */}
          <g>
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="3.5s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
            />
            {/* Pommel */}
            <circle cx="293" cy="328" r="5.5" fill="rgba(255,255,255,0.48)" />
            {/* Grip */}
            <line x1="300" y1="303" x2="293" y2="327" stroke="rgba(255,255,255,0.4)" strokeWidth="5.5" strokeLinecap="round" />
            {/* Crossguard */}
            <line x1="287" y1="320" x2="313" y2="311" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round" />
            {/* Blade */}
            <path d="M295 323 C293 391 284 481 276 519" stroke="rgba(255,255,255,0.48)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Fuller / edge gleam */}
            <path d="M297 326 C295 391 287 476 279 515" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" />
            {/* Tip */}
            <path d="M274 521 L273 535 L281 521 Z" fill="rgba(255,255,255,0.48)" />
          </g>

        </g>
      </svg>
    </div>
  );
}
