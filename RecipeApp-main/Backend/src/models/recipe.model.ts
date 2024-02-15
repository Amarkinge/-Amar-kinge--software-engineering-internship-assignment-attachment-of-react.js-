import { Schema, model, Document } from 'mongoose';

interface IRecipe extends Document {
  id: string;
  Title: string;
  Ingredients: object;
  Instructions: string;
  Image: string;
}

const recipeSchema = new Schema<IRecipe>({
  id: {
    type: String,
    required: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Ingredients: {
    type: Object,
    required: true,
  },
  Instructions: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  // Add more fields as needed
}, {
  versionKey: false,
  timestamps: false, // add timestamps for createdAt and updatedAt fields
});

recipeSchema.index({ Title: 'text' }); // create a text index for title field for full-text search


const Recipe = model<IRecipe>('Recipe', recipeSchema);

export default Recipe;