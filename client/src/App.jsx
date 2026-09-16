import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx';
import Home from './pages/Home.jsx';
import Quiz from './pages/Quiz.jsx';

function Layout({ children }) {
  return <main className="min-h-screen bg-stone-100 px-5 py-8 text-emerald-950"><div className="mx-auto max-w-md"><a className="font-bold tracking-wide text-emerald-950 no-underline" href="/">Besoia</a><div className="mt-16">{children}</div></div></main>;
}

export default function App() {
  return <BrowserRouter><UserProvider><Layout><Routes><Route path="/" element={<Home />} /><Route path="/quiz" element={<Quiz />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></Layout></UserProvider></BrowserRouter>;
}
