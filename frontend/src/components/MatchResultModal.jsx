import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Avatar } from './ui.jsx';

const CONFETTI_COLORS = ['#d15f35', '#12372f', '#f9d7b8', '#e8894f', '#7fa89c'];

function scoreLabel(score) {
  if (score >= 86) return 'Practically twins';
  if (score >= 58) return 'Strong signal';
  if (score >= 29) return 'Some common ground';
  return 'Opposites attract';
}

function useCountUp(target, duration = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

function ScoreRing({ score }) {
  const value = useCountUp(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  return <div className="relative mx-auto h-40 w-40">
    <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128" aria-hidden="true">
      <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(18,55,47,0.08)" strokeWidth="10" />
      <circle cx="64" cy="64" r={radius} fill="none" stroke="url(#score-gradient)" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} />
      <defs>
        <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8894f" />
          <stop offset="100%" stopColor="#d15f35" />
        </linearGradient>
      </defs>
    </svg>
    <div className="absolute inset-0 grid place-items-center">
      <p className="font-display text-5xl font-semibold tabular-nums">{value}<span className="text-2xl text-ink/50">%</span></p>
    </div>
  </div>;
}

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 48 }, (_, index) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.2 + Math.random() * 1.6,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 6,
    round: Math.random() > 0.6
  })), []);
  return <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden motion-reduce:hidden" aria-hidden="true">
    {pieces.map((piece, index) => <span key={index} className="absolute top-0 animate-confetti"
      style={{ left: `${piece.left}%`, width: piece.size, height: piece.round ? piece.size : piece.size * 0.45, background: piece.color, borderRadius: piece.round ? '999px' : '2px', animationDelay: `${piece.delay}s`, animationDuration: `${piece.duration}s` }} />)}
  </div>;
}

export default function MatchResultModal({ match, onClose, userName, celebrate = true }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!match) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus?.();
    };
  }, [match, onClose]);

  if (!match) return null;
  const friendName = match.friend?.name || 'your friend';
  const shared = match.sharedAnswers || [];

  // Portal to body: the page wrapper animates transform, which would otherwise trap position:fixed.
  return createPortal(<div className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="match-result-title" onClick={(event) => event.target === event.currentTarget && onClose()}>
    {celebrate && <Confetti />}
    <div ref={panelRef} tabIndex={-1} className="max-h-[92vh] max-h-[92dvh] w-full outline-none max-w-lg animate-pop overflow-y-auto rounded-t-[2rem] bg-cream p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center shadow-2xl sm:rounded-[2rem] sm:p-9">
      <div className="flex items-center justify-center">
        <Avatar name={userName} tone="ink" className="h-12 w-12 text-base ring-4 ring-cream" />
        <Avatar name={friendName} className="-ml-3 h-12 w-12 text-base ring-4 ring-cream" />
      </div>
      <p className="eyebrow mt-4">{celebrate ? 'New connection' : 'Your connection'}</p>
      <h2 id="match-result-title" className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">You &amp; {friendName}</h2>

      <div className="mt-6"><ScoreRing score={match.score} /></div>
      <p className="mt-3 inline-flex rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent-dark">{scoreLabel(match.score)}</p>

      <div className="mt-7 text-left">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">You both picked · {shared.length} of 7</h3>
        {shared.length > 0
          ? <ul className="mt-3 space-y-2">
            {shared.map((item, index) => <li className="flex animate-fade-up items-start gap-3 rounded-2xl bg-white/80 p-3.5 ring-1 ring-ink/5" key={item.questionId} style={{ animationDelay: `${500 + index * 90}ms` }}>
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-cream">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg>
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{item.answer}</p>
                <p className="mt-0.5 text-sm leading-5 text-ink-soft">{item.question}</p>
              </div>
            </li>)}
          </ul>
          : <p className="mt-3 rounded-2xl bg-white/80 p-4 text-sm leading-6 text-ink-soft ring-1 ring-ink/5">No identical picks, so you have plenty to talk about.</p>}
      </div>

      <div className="relative mt-6 rounded-2xl bg-ink p-5 text-left text-cream">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-peach">Start with this</p>
        <p className="mt-2 font-display text-xl leading-snug">“{match.icebreaker}”</p>
      </div>

      <div className="sticky -bottom-6 -mx-6 mt-4 bg-gradient-to-t from-cream from-70% to-transparent px-6 pb-1 pt-5 sm:static sm:mx-0 sm:mt-7 sm:bg-none sm:p-0">
        <button type="button" className="btn btn-accent w-full" onClick={onClose}>Done</button>
      </div>
    </div>
  </div>, document.body);
}
