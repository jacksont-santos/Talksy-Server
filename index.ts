import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { connectToDatabase } from './src/database/connection/mongo';
import userRouter from './src/User/userController';
import roomRouter from './src/Room/roomController';

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

app.use('/user', userRouter);
app.use('/room', roomRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

(async () => {
  await connectToDatabase();
})();

interface CustomError extends Error {
  statusCode?: number;
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({message: err.message});
});