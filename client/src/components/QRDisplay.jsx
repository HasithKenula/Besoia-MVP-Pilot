import { QRCodeCanvas } from 'qrcode.react';

export default function QRDisplay({ sessionId }) {
  return <div className="inline-block rounded bg-stone-100 p-3" aria-label="Your Besoia QR code"><QRCodeCanvas value={sessionId} size={240} bgColor="#f5f5f4" fgColor="#022c22" includeMargin /></div>;
}
