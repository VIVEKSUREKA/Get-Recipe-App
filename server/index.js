import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import { Configuration, OpenAIApi } from 'openai';
import handleRoute from './controller/index.js';

// import axios from 'axios';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, Welcome to the backend of Recipe App!');
});

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

app.get('/api/recipe', (req, res) => {
  res.send('This is the recipe API');
});

// const apiKey = process.env.OPENAI_API_KEY;

app.post('/api/recipe',handleRoute );

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});