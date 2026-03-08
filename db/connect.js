import mongoose from 'mongoose';

const connectDB = (URL) => {
  return mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  });
}

export default connectDB