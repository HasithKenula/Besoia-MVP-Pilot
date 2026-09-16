import { Router } from 'express';
import { listQuestions, saveAnswers } from '../controllers/quizController.js';

const router = Router();
router.get('/questions', listQuestions);
router.post('/answers', saveAnswers);
export default router;
