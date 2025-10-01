import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI_LOCAL;

    await mongoose.connect(mongoUri);

    console.log(' >>>DB connected');
  } catch (error) {
    console.log(error);
  }
};
