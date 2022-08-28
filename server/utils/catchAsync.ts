import { NextFunction, Response } from 'express';
import { IRequest } from '../interfaces';

export default (fn: Function) =>
  (req: IRequest, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);
