import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userRouter } from '../routes/Users.js';
import { RecipeRouter } from '../routes/Recipe.js';
import path from 'path';
import {fileURLToPath} from 'url';
const app = express();

app.use(express.json());
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// User route prefix
app.use('/auth', userRouter);
//Recipe route prefix
app.use('/recipe', RecipeRouter);
dotenv.config();
//Connect to database
mongoose.connect(process.env.DATABASE_URL);

app.listen(process.env.PORT || 3002, () => {
  console.log(`Server Running On Port ${process.env.PORT}`);
});
