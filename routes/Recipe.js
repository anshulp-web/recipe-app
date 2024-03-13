import express from 'express';
import RecipeModel from '../models/Recipes.js';
import UserModel from '../models/User.js';
import { verifyToken } from './Users.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const response = await RecipeModel.find({});
  res.json(response);
});

router.post('/save', async (req, res) => {
  try {
    const findUser = await UserModel.findOne({ _id: req.body.ownerId });

    if (findUser) {
      const recipe = new RecipeModel(req.body);
      const response = await recipe.save();
      res.json(response);
    } else {
      res.json({ message: 'Invalid User' });
    }
  } catch (error) {
    if (error.name == 'CastError') {
      res.status(400).json({ message: 'Invalid owner id' });
    } else {
      res.status(500).json({ message: 'Internal sever error' });
    }
  }
});

router.put('/', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.UserId);
    const recipe = await RecipeModel.findById(req.body.recipeId);
    user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

router.get('/savedRecipes/ids/:UserId', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.UserId);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

router.get('/savedRecipes/:UserId', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.UserId);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes: savedRecipes });
  } catch (error) {
    res.json(error);
  }
});
export { router as RecipeRouter };
