import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getInitials } from './ui.jsx';

// Other people at the event: fixed positions so the layout is stable between renders.
const CROWD = [
  [8, 18], [16, 72], [24, 38], [34, 88], [44, 12], [58, 82], [66, 30], [74, 64],
  [82, 14], [90, 46], [94, 84], [6, 52], [52, 50], [28, 60], [86, 28], [40, 70]
];

const CURVE = 'M92 262 C 170 110, 232 300, 308 148';

function Person({ x, y, fill, label, delay }) {
  return <g className="animate-bob" style={{ animationDelay: delay }}>
    <circle cx={x} cy={y} r="44" fill={fill} fillOpacity="0.14" className="origin-center animate-halo [transform-box:fill-box]" />
    <circle cx={x} cy={y} r="28" fill={fill} />
    {label
      ? <text x={x} y={y + 6} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="17" fontWeight="700" fill="#f4f0e8">{label}</text>
      : <g fill="#f4f0e8">
        <circle cx={x} cy={y - 6} r="7" />
        <path d={`M${x - 12} ${y + 14} a12 10 0 0 1 24 0 z`} />
      </g>}
  </g>;
}

export default function SignalBackground({ name = '' }) {
  const rootRef = useRef(null);

  // Gentle parallax: the two glows lean away from each other as the pointer moves.
  useEffect(() => {
    let frame = 0;
    function onMove(event) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        rootRef.current?.style.setProperty('--mx', x.toFixed(3));
        rootRef.current?.style.setProperty('--my', y.toFixed(3));
      });
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', onMove); };
  }, []);

  const initials = name.trim() ? getInitials(name) : '';

  // Portal to body: the page wrapper animates transform, which would trap position:fixed.
  return createPortal(<div ref={rootRef} className="pointer-events-none fixed inset-0 z-0 animate-fade-in overflow-hidden" aria-hidden="true">
    {/* Dot grid texture, faded out towards the edges */}
    <div className="absolute inset-0 bg-[radial-gradient(rgba(18,55,47,0.09)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

    {/* Person A (green) and person B (orange) drifting towards each other */}
    <div className="absolute -left-[20vmax] -top-[18vmax] transition-transform duration-700 ease-out" style={{ transform: 'translate3d(calc(var(--mx, 0) * -48px), calc(var(--my, 0) * -36px), 0)' }}>
      <div className="h-[62vmax] w-[62vmax] animate-drift-a rounded-full bg-[radial-gradient(circle,rgba(18,55,47,0.26)_0%,rgba(18,55,47,0.08)_40%,transparent_68%)] blur-2xl" />
    </div>
    <div className="absolute -bottom-[22vmax] -right-[18vmax] transition-transform duration-700 ease-out" style={{ transform: 'translate3d(calc(var(--mx, 0) * 48px), calc(var(--my, 0) * 36px), 0)' }}>
      <div className="h-[64vmax] w-[64vmax] animate-drift-b rounded-full bg-[radial-gradient(circle,rgba(209,95,53,0.34)_0%,rgba(249,215,184,0.35)_38%,transparent_68%)] blur-2xl" />
    </div>

    {/* The crowd */}
    {CROWD.map(([left, top], index) => <span key={index} className={`absolute h-1.5 w-1.5 animate-twinkle rounded-full ${index % 2 ? 'bg-accent' : 'bg-ink'} ${index % 2 ? 'hidden sm:block' : ''}`}
      style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${(index * 0.37) % 4.5}s` }} />)}

    {/* Two people, one signal */}
    <div className="absolute right-[4%] top-[20%] hidden w-[340px] transition-transform duration-700 ease-out lg:block xl:right-[8%] xl:w-[400px]" style={{ transform: 'translate3d(calc(var(--mx, 0) * 18px), calc(var(--my, 0) * 18px), 0)' }}>
      <svg viewBox="0 0 400 400" className="h-auto w-full overflow-visible">
        <defs>
          <linearGradient id="signal-line" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#12372f" />
            <stop offset="100%" stopColor="#d15f35" />
          </linearGradient>
        </defs>
        {[0, 1.2, 2.4].map((delay) => <circle key={delay} cx="200" cy="205" r="26" fill="none" stroke="#d15f35" strokeWidth="1.5" className="origin-center animate-ripple [transform-box:fill-box]" style={{ animationDelay: `${delay}s` }} />)}
        <path d={CURVE} fill="none" stroke="rgba(18,55,47,0.12)" strokeWidth="3" strokeLinecap="round" />
        <path d={CURVE} fill="none" stroke="url(#signal-line)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 14" className="animate-dash-flow" />
        <circle r="6" fill="#d15f35" className="motion-reduce:hidden">
          <animateMotion dur="3.2s" repeatCount="indefinite" path={CURVE} keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear" />
        </circle>
        <circle cx="200" cy="205" r="9" fill="#fff" stroke="#d15f35" strokeWidth="3" />
        <Person x={92} y={262} fill="#12372f" label={initials} delay="0s" />
        <Person x={308} y={148} fill="#d15f35" label="" delay="-2s" />
      </svg>
    </div>
  </div>, document.body);
}
