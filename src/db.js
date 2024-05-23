import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost/bdnueva');
    console.log(' >>>DB connected');
  } catch (error) {
    console.log('aqui');
    console.log(error);
  }
};
