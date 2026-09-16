import { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function CameraScanner({ onScan, onError }) {
  useEffect(() => {
    const scanner = new Html5Qrcode('besoia-qr-reader');
    scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 220, height: 220 } }, (decodedText) => {
      onScan(decodedText);
      scanner.stop().catch(() => {});
    }, () => {}).catch(onError);
    return () => { scanner.stop().catch(() => {}); };
  }, [onError, onScan]);

  return <div id="besoia-qr-reader" className="mt-6 overflow-hidden rounded border border-emerald-900/30" />;
}
