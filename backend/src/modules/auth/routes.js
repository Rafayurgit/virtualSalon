import express from 'express';
import { placeholder } from './controller.js';

const router = express.Router();

router.get('/', placeholder);

export default router;
