import 'dotenv/config';
import { connectMongo } from './src/Mongo/connectMongo';
import { createApp } from './src/app';

const app = createApp();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

(async () => {
  await connectMongo();
})();