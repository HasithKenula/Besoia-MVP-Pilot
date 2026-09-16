import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api.js';
import { useUser } from '../context/UserContext.jsx';

export default function Home() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      setUser(await registerUser(name));
      navigate('/quiz');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return <section><p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">Step 1</p><h1 className="mt-4 text-6xl font-bold leading-none">Find your shared signal.</h1><p className="mt-6 text-lg text-emerald-900/70">Register with your name, then answer seven quick questions.</p><form className="mt-10" onSubmit={handleSubmit}><label className="text-sm font-bold" htmlFor="name">Your name</label><input className="mt-2 w-full rounded border border-emerald-900/30 bg-white/50 p-3" id="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} placeholder="Type your name" /><button className="mt-4 rounded bg-emerald-950 px-5 py-3 text-stone-100" type="submit">Start the questions</button>{error && <p className="mt-3 text-sm text-red-700">{error}</p>}</form></section>;
}
