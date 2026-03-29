import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectMongo } from './src/Mongo/connectMongo';

import { errorHandler } from './src/middlewares/errorHandler';
import userRouter from './src/User/Routes/routes';
import roomRouter from './src/Room/Routes/routes';
import authRouter from './src/Auth/Routes/routes';

const app = express();

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
app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('ok');
});

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/room', roomRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

(async () => {
  await connectMongo();
})();

app.use(errorHandler);