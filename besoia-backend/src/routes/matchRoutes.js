import { Router } from 'express';
import { createMatch, getPendingMatch } from '../controllers/matchController.js';

const router = Router();
router.post('/scan', createMatch);
router.get('/pending', getPendingMatch);
export default router;
