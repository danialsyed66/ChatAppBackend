import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import { Response, NextFunction } from 'express';

import { AppError, catchAsync, sendToken } from '../utils';
import { User } from '../models';
import { IRequest } from '../interfaces';

export const register = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { name, email, password, avatar, role, verification } = req.body;

    let roles = 'user';
    if (role) roles = 'seller-pending';

    let avatarResult: any;
    if (avatar)
      avatarResult = await cloudinary.v2.uploader.upload(avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale',
      });

    const user = await User.create({
      name,
      email,
      password,
      avatar: avatar
        ? {
            public_id: avatarResult?.public_id,
            url: avatarResult?.secure_url,
          }
        : {
            url: 'https://res.cloudinary.com/dlwaao9wl/image/upload/v1655495372/avatars/default_avatar_a47u26.jpg',
          },
      role: roles,
    });

    sendToken(user, res, 201);
  }
);

export const login = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(
        new AppError('Please enter email and password to login', 401)
      );

    const user = await User.findOne({ email }).select('+password');

    if (!user) return next(new AppError('Wrong email or password', 401));

    const passwordMatched = await user.comparePasswords(password);

    if (!passwordMatched)
      return next(new AppError('Wrong email or password', 401));

    sendToken(user, res, 201);
  }
);

export const logout = (req: IRequest, res: Response, next: NextFunction) => {
  res
    .status(200)
    .cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      status: 'success',
      message: 'Logged out',
    });
};

export const auth = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    if (!req.headers) return next(new AppError('You are not logged in.', 400));

    const { token } = req.headers;

    if (!token) return next(new AppError('You are not logged in.', 401));

    if (typeof token !== 'string')
      return next(new AppError('You are not logged in.', 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '');

    if (typeof decoded === 'string')
      return next(new AppError('You are not logged in.', 401));

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) return next(new AppError('User not found', 401));

    req.user = currentUser;

    next();
  }
);
