import { Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: string;
  sender: string;
  text: string;
}
