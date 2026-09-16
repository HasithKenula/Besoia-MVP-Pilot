import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions, submitAnswers } from '../services/api.js';
import { useUser } from '../context/UserContext.jsx';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => { fetchQuestions().then(setQuestions).catch((requestError) => setError(requestError.message)); }, []);
  async function handleSubmit(event) {
    event.preventDefault();
    try { await submitAnswers(answers); setUser({ ...user, answers }); navigate('/match'); }
    catch (requestError) { setError(requestError.message); }
  }

  return <section><p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">Step 2</p><h1 className="mt-4 text-5xl font-bold leading-none">Seven small choices.</h1><form className="mt-8 space-y-5" onSubmit={handleSubmit}>{questions.map((question) => <label className="block" key={question.id}><span className="block text-sm font-bold">{question.prompt}</span><select className="mt-2 w-full rounded border border-emerald-900/30 bg-white/50 p-3" required value={answers[question.id] || ''} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}><option value="">Choose one</option><option value="a">Option A</option><option value="b">Option B</option><option value="c">Option C</option></select></label>)}<button className="rounded bg-emerald-950 px-5 py-3 text-stone-100" type="submit" disabled={questions.length !== 7}>Save answers</button>{error && <p className="text-sm text-red-700">{error}</p>}</form></section>;
}
