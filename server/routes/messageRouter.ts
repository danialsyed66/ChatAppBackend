import { Router } from 'express';

import { auth } from '../controllers/authController';
import { getMessages, sendMessage } from '../controllers/messageController';

const router = Router();

router.route('/:conversationId').get(auth, getMessages);
router.route('/').post(auth, sendMessage);

export default router;
