import { Router } from 'express';
import { exportEvents, logEvent } from '../controllers/eventController.js';

const router = Router();
router.post('/', logEvent);
router.get('/export.csv', exportEvents);
export default router;
