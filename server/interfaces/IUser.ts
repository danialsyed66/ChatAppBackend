import { Document } from 'mongoose';
import { IAvatar } from './IAvatar';

export interface IUser extends Document {
  name: string;
  email: string | undefined;
  password: string | undefined;
  avatar?: IAvatar;
  getJWT: Function;
  comparePasswords: Function;
}
