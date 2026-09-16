import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraScanner from '../components/CameraScanner.jsx';
import QRDisplay from '../components/QRDisplay.jsx';
import { logQrGenerated, scanMatch } from '../services/api.js';
import { useUser } from '../context/UserContext.jsx';

export default function ScanOrShow() {
  const [mode, setMode] = useState('choose');
  const [error, setError] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();
  const handleScan = useCallback(async (sessionId) => { try { await scanMatch(sessionId); navigate('/result'); } catch (requestError) { setError(requestError.message); } }, [navigate]);
  async function showQr() { setMode('show'); try { await logQrGenerated(); } catch {} }
  return <section><p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">Step 3</p><h1 className="mt-4 text-5xl font-bold leading-none">Swap your signal.</h1>{mode === 'choose' && <div className="mt-8 grid gap-3"><button className="rounded bg-emerald-950 px-5 py-3 text-stone-100" onClick={showQr}>Show my QR code</button><button className="rounded border border-emerald-950 px-5 py-3" onClick={() => setMode('scan')}>Scan their QR code</button></div>}{mode === 'show' && <div className="mt-8 text-center"><QRDisplay sessionId={user?.sessionId} /><p className="mt-4 text-emerald-900/70">Let your partner scan this code. This screen will update when you match.</p><button className="mt-4 rounded border border-emerald-950 px-5 py-3" onClick={() => navigate('/result')}>Continue</button></div>}{mode === 'scan' && <div className="mt-8"><p>Allow camera access and point it at their code.</p><CameraScanner onScan={handleScan} onError={() => setError('Camera access is required to scan.')} /></div>}{error && <p className="mt-4 text-sm text-red-700">{error}</p>}</section>;
}
