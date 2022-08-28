import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { IUser } from '../interfaces';

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxlength: [35, 'Name should be less than 35 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'Please enter a valid email'],
      maxlength: [35, 'Email should be less than 35 characters'],
      unique: [true, 'Email already exists'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password should be at least 6 characters'],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

Schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

Schema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY || '', {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

Schema.methods.comparePasswords = function (givenPassword: string) {
  return bcrypt.compare(givenPassword, this.password);
};

const model = mongoose.model<IUser>('User', Schema);

export default model;
