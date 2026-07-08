import cors from 'cors';
import express from 'express';
import authRouter from './Auth/Routes/routes';
import roomRouter from './Room/Routes/routes';
import userRouter from './User/Routes/routes';
import { errorHandler } from './middlewares/errorHandler';

const environment = process.env.ENVIRONMENT || 'development';
const corsOptions = {
  origin: (origin, callback) => {
    if (environment === 'production' && origin === 'https://myapp.com')
      callback(null, true);
    else if (environment === 'development')
      callback(null, true);
    else
      callback(new Error('Not allowed by CORS'));
  }
};

export const createApp = () => {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.send('manager ok');
  });

  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/room', roomRouter);

  app.use(errorHandler);

  return app;
};

