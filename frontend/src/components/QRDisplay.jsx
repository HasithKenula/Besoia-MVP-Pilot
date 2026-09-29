import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRDisplay({ sessionId, name }) {
  const containerRef = useRef(null);

  function saveImage() {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `besoia-${(name || 'code').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
    link.click();
  }

  return <div className="flex flex-col items-center">
    <div className="relative">
      <span className="absolute -inset-2 animate-halo rounded-[2rem] bg-gradient-to-br from-peach to-accent/40 blur-md" aria-hidden="true" />
      <div ref={containerRef} className="relative rounded-3xl bg-white p-2 shadow-[0_20px_40px_-20px_rgba(18,55,47,0.45)] ring-1 ring-ink/10" role="img" aria-label={`QR code for ${name || 'you'}`}>
        <QRCodeCanvas className="block" style={{ width: 'min(220px, 60vw)', height: 'auto', aspectRatio: '1 / 1' }} value={sessionId || ''} size={440} bgColor="#ffffff" fgColor="#12372f" marginSize={4} level="M" />
      </div>
    </div>
    <button type="button" className="btn btn-ghost mt-4 text-sm" onClick={saveImage}>
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 3v10m0 0-4-4m4 4 4-4M4 16h12" /></svg>
      Save as image
    </button>
  </div>;
}
