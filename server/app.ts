import express from 'express';
import cors from 'cors';
import { AppError } from './utils';
import errorController from './controllers/errorController';
import { userRouter } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Given route ${req.originalUrl} doesnot exist`, 404));
});

app.use(errorController);

export default app;
