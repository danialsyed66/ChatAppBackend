import mongoose from 'mongoose';

import { IConversation } from '../interfaces';

const Schema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model<IConversation>('Conversation', Schema);
