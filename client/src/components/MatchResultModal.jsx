export default function MatchResultModal({ match, onClose }) {
  if (!match) return null;

  return <div className="fixed inset-0 z-50 grid place-items-center bg-emerald-950/70 p-5" role="dialog" aria-modal="true" aria-labelledby="match-result-title">
    <div className="w-full max-w-lg rounded-2xl bg-stone-100 p-7 text-center shadow-2xl sm:p-10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">New connection</p>
      <h2 id="match-result-title" className="mt-4 text-3xl font-bold text-emerald-950 sm:text-5xl">You and {match.friend?.name || 'your friend'} are {match.score}% in sync.</h2>
      <p className="mt-4 text-lg text-emerald-900/70">Your shared signal is ready.</p>
      <div className="mt-7 border-l-4 border-orange-700 bg-white/50 p-5 text-left text-xl text-emerald-950">{match.icebreaker}</div>
      <button type="button" className="mt-7 rounded bg-emerald-950 px-5 py-3 text-stone-100" onClick={onClose}>Close</button>
    </div>
  </div>;
}
