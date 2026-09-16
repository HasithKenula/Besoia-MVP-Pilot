async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Request failed');
  return body;
}

export const registerUser = (name) => request('/api/register', { method: 'POST', body: JSON.stringify({ name }) });
export const fetchQuestions = () => request('/api/quiz/questions');
export const submitAnswers = (answers) => request('/api/quiz/answers', { method: 'POST', body: JSON.stringify({ answers }) });
export const scanMatch = (sessionId) => request('/api/matches/scan', { method: 'POST', body: JSON.stringify({ sessionId }) });
export const fetchPendingMatch = () => request('/api/matches/pending');
