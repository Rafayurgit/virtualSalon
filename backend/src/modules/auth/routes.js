import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { register, login } from './controller.js';

const router = express.Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

export default router;
import express from 'express';
import { placeholder } from './controller.js';

const router = express.Router();

router.get('/', placeholder);

export default router;
