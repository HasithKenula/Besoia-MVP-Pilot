import { useEffect, useState } from 'react';
import { fetchPendingMatch } from '../services/api.js';
import { useNavigate } from 'react-router-dom';

export default function Result() {
  const [match, setMatch] = useState(null);
  const navigate = useNavigate();
  useEffect(() => { let active = true; const check = async () => { try { const result = await fetchPendingMatch(); if (active && result.match) setMatch(result.match); } catch {} }; check(); const timer = setInterval(check, 2000); return () => { active = false; clearInterval(timer); }; }, []);
  return <section className="text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">Step 4</p>{match ? <><h1 className="mt-4 text-6xl font-bold leading-none">{match.score}% in sync.</h1><p className="mt-6 text-lg text-emerald-900/70">Your shared signal is ready.</p><div className="mt-8 border-l-4 border-orange-700 p-5 text-left text-xl">{match.icebreaker}</div></> : <><h1 className="mt-4 text-5xl font-bold leading-none">Waiting for your match.</h1><p className="mt-6 text-emerald-900/70">Keep this screen open while the other person scans.</p></>}<button type="button" className="mt-8 rounded border border-emerald-950 px-5 py-3" onClick={() => navigate('/match')}>Back</button></section>;
}
