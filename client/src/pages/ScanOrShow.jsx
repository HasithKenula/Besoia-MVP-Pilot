import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraScanner from '../components/CameraScanner.jsx';
import QRDisplay from '../components/QRDisplay.jsx';
import MatchResultModal from '../components/MatchResultModal.jsx';
import { logQrGenerated, scanMatch } from '../services/api.js';
import { useUser } from '../context/UserContext.jsx';

export default function ScanOrShow() {
  const [mode, setMode] = useState('choose');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const { user, friends, addFriend } = useUser();
  const navigate = useNavigate();
  const handleScan = useCallback(async (sessionId) => {
    try {
      const response = await scanMatch(sessionId);
      addFriend({ ...response.match.friend, score: response.match.score, icebreaker: response.match.icebreaker });
      setResult(response.match);
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [addFriend]);
  async function showQr() { setMode('show'); try { await logQrGenerated(); } catch {} }
  return <section><p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">Step 3</p><h1 className="mt-4 text-5xl font-bold leading-none">Swap your signal.</h1>{mode === 'choose' && <div className="mt-8 grid gap-3"><button className="rounded bg-emerald-950 px-5 py-3 text-stone-100" onClick={showQr}>Show my QR code</button><button className="rounded border border-emerald-950 px-5 py-3" onClick={() => setMode('scan')}>Scan their QR code</button></div>}{mode === 'show' && <div className="mt-8 text-center"><QRDisplay sessionId={user?.sessionId} /><p className="mt-4 text-emerald-900/70">Let your partner scan this code. This screen will update when you match.</p></div>}{mode === 'scan' && <div className="mt-8"><p>Use the camera, or upload a screenshot of the QR code from the other screen.</p><CameraScanner onScan={handleScan} onError={setError} /></div>}{friends.length > 0 && <div className="mt-10"><h2 className="text-xl font-bold">Your friends</h2><ul className="mt-3 space-y-3">{friends.map((friend) => <li className="rounded border border-emerald-900/15 bg-white/50 p-4" key={friend.id}><p className="font-bold">{friend.name}</p>{friend.score !== undefined && <><p className="mt-1 text-lg">{friend.score}% in sync</p><p className="mt-2 text-sm text-emerald-900/70">{friend.icebreaker}</p></>}</li>)}</ul></div>}{mode !== 'choose' && <button type="button" className="mt-4 rounded border border-emerald-950 px-5 py-3" onClick={() => { setError(''); setMode('choose'); }}>Back</button>}{error && <div className="mt-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800"><p>{error}</p>{mode === 'scan' && <button type="button" className="mt-3 rounded border border-red-800 px-4 py-2" onClick={() => { setError(''); setMode('scan'); }}>Try again or upload an image</button>}</div>}<MatchResultModal match={result} onClose={() => setResult(null)} /></section>;
}
