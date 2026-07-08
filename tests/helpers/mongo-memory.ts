import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export const connectTestDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
};

export const clearTestDatabase = async () => {
  const { collections } = mongoose.connection;
  const deletePromises = Object.values(collections).map((collection) =>
    collection.deleteMany({})
  );
  await Promise.all(deletePromises);
};

export const disconnectTestDatabase = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
};

