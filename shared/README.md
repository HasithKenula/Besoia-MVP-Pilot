# shared/

Reserved for code that both the frontend and the backend need, such as constants or validation rules. It is currently empty.

For now, the single source of truth lives in the backend:

- Questions: `backend/src/config/questions.js`. The frontend fetches them from `GET /api/quiz/questions`.
- Scoring: `backend/src/utils/scoringEngine.js`. Results reach the frontend as part of the match response.

Keep this folder small for the pilot. Only move something here if the frontend needs to run the same logic itself, without calling the API.
