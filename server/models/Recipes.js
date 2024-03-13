import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingrediants: [{ type: String, required: true }],
  instructions: { type: String, requierd: true },
  imageUrl: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const RecipeModel = mongoose.model('recipes', RecipeSchema);
export default RecipeModel;
