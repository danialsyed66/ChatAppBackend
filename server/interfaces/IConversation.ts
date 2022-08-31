import { Document } from 'mongoose';
import { IUser } from './IUser';

export interface IConversation extends Document {
  members: IUser[];
}
