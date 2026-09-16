export function calculateCompatibility(firstAnswers, secondAnswers) {
  const questionIds = Object.keys(firstAnswers);
  if (questionIds.length !== 7) return 0;
  const matches = questionIds.filter((questionId) => firstAnswers[questionId] === secondAnswers[questionId]).length;
  return Math.round((matches / 7) * 100);
}
