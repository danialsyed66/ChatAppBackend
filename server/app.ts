import express from 'express';
import cors from 'cors';
import { AppError } from './utils';
import errorController from './controllers/errorController';
import { routesInfo } from './controllers/routesController';
import { userRouter, conversationRouter, messageRouter } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', routesInfo);

app.use('/api/v1', userRouter);
app.use('/api/v1/conversations', conversationRouter);
app.use('/api/v1/messages', messageRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Given route ${req.originalUrl} doesnot exist`, 404));
});

app.use(errorController);

export default app;
