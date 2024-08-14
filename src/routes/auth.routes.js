import { Router } from 'express';
import {
  login,
  register,
  logout,
  profile,
  verifyEmail,
} from '../controllers/auth.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', auth, profile);

export default router;
