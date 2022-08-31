import { Router } from 'express';

import { auth } from '../controllers/authController';
import {
  myConversations,
  createOrGetConversation,
} from '../controllers/conversationController';

const router = Router();

router
  .route('/')
  .get(auth, myConversations)
  .post(auth, createOrGetConversation);

export default router;
