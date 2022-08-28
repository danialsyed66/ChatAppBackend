import { Response } from 'express';
import { IUser } from '../interfaces';

export default (user: IUser, res: Response, statusCode: number) => {
  try {
    const token = user.getJWT();

    user.password = undefined;
    user.__v = undefined;

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    throw err;
  }
};
