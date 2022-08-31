import { Router } from 'express';

import {
  register,
  login,
  logout,
  auth,
  getUserProfile,
} from '../controllers/authController';

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);

router.route('/profile').get(auth, getUserProfile);

export default router;
