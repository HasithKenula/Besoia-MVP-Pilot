import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="min-h-screen bg-stone-100 px-5 py-8 text-emerald-950">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">Besoia</p>
        <h1 className="mt-16 text-6xl font-bold leading-none">Find your shared signal.</h1>
        <p className="mt-6 text-lg text-emerald-900/70">A small compatibility experiment is getting ready.</p>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
