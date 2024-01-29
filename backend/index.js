import express from 'express';
import mongoose from 'mongoose';
import { PORT, MONGODB_URL } from './config.js';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';
const app = express();

// Middleware for parsing request body
app.use(express.json());

//Middleware for handling cors policy
// Option 1: Allow All origins with default of cors(*)
app.use(cors());
//option 2: Allow Custom Origins
// app.use(
//     cors({
//         origin: 'http://localhost:3000',
//         methods: ['GET','POST','PUT','DELETE'],
//         allowedHeaders: ['Content-Type'],
//     })
// );


//for testing purposes
app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send("Hello World");
});

app.use('/books',booksRoute);

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
