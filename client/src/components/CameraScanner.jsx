import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function CameraScanner({ onScan, onError }) {
  const scannerRef = useRef(null);
  const [mode, setMode] = useState('camera');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (mode !== 'camera') return undefined;
    const scanner = new Html5Qrcode('besoia-qr-reader');
    scannerRef.current = scanner;
    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (decodedText) => {
        onScan(decodedText);
        scanner.stop().catch(() => {});
      },
      () => {}
    ).catch(onError);
    return () => {
      scanner.stop().catch(() => {});
      scanner.clear();
    };
  }, [mode, onError, onScan]);

  async function scanFile(file) {
    if (!file) return;
    setFileName(file.name);
    try {
      const scanner = new Html5Qrcode('besoia-file-reader');
      const decodedText = await scanner.scanFile(file, true);
      scanner.clear();
      onScan(decodedText);
    } catch {
      onError('No QR code was found in that image. Try a clear screenshot or saved QR image.');
    }
  }

  function handleFileChange(event) {
    scanFile(event.target.files?.[0]);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    scanFile(event.dataTransfer.files?.[0]);
  }

  return <div className="mt-6">
    <div className="grid grid-cols-2 gap-2">
      <button type="button" className={mode === 'camera' ? 'rounded bg-emerald-950 px-3 py-2 text-sm text-stone-100' : 'rounded border border-emerald-950 px-3 py-2 text-sm'} onClick={() => setMode('camera')}>Use camera</button>
      <button type="button" className={mode === 'file' ? 'rounded bg-emerald-950 px-3 py-2 text-sm text-stone-100' : 'rounded border border-emerald-950 px-3 py-2 text-sm'} onClick={() => setMode('file')}>Upload QR image</button>
    </div>
    {mode === 'camera' ? <div id="besoia-qr-reader" className="mt-4 overflow-hidden rounded border border-emerald-900/30" /> : <div id="besoia-file-reader" className="mt-4">
      <label className={`block cursor-pointer rounded border-2 border-dashed p-8 text-center ${isDragging ? 'border-orange-700 bg-orange-50' : 'border-emerald-900/30 bg-white/40'}`} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
        <span className="block font-bold">Drop a QR screenshot here</span>
        <span className="mt-2 block text-sm text-emerald-900/65">or tap to choose an image file</span>
        <input className="sr-only" type="file" accept="image/*" onChange={handleFileChange} />
      </label>
      {fileName && <p className="mt-2 text-sm text-emerald-900/65">Scanning: {fileName}</p>}
    </div>}
  </div>;
}
