import { Router, Request, Response } from 'express';
import Recipe from '../models/recipe.model';


const recipeRouter = Router();


recipeRouter.get('/recipes', async (req:Request,res:Response) => {
    try {
        const examples = await Recipe.find();
        res.json(examples);
      } catch (error: any) {
        res.status(500).json({ Message: error.message });
      }
});


recipeRouter.post('/add',async (req:Request,res:Response) => {
 
    try {
      if(!req.body)
      {
        throw new Error("Invalid data");
      }
      const recipe = new Recipe(req.body);
      const savedRecipe = await Recipe.create(recipe);
      res.status(201).json(savedRecipe);
   
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
});

recipeRouter.get('/getByRecipeId/:id',async (req:Request,res:Response) => {
    const id = String(req.params.id);
    try {
      const recipe = await Recipe.findOne({ id });
      if (!recipe) {
        return res.status(400).json({ message: 'Cannot find the recipe.' })
      }
      else{
        res.status(200).json(recipe);
      }
      
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
});

recipeRouter.get('/getByObjectId',async (req:Request,res:Response) => {
  const _id = String(req.query.recipeId);
  try {
    const recipe = await Recipe.findById(_id);
    if (!recipe) {
      return res.status(400).json({ message: 'Cannot find the recipe.' })
    }
    else{
      res.status(200).json(recipe);
    }
    
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});



recipeRouter.delete('/deleteByRecipeId/:id',async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const recipe = await Recipe.findOne({ id });
      if (!recipe) {
        return res.status(400).json({ message: 'Recipe does not exits.' })
      }
      else{
        await Recipe.findByIdAndDelete(recipe?._id);
        res.status(200).json({ message: 'Recipe deleted successfully.' });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });


  recipeRouter.delete('/deleteByObjectId',async (req: Request, res: Response) => {
    const id = req.query.recipeId;
    try {
      const recipe = await Recipe.findByIdAndDelete(id);
      if (!recipe) {
        return res.status(400).json({ message: 'Recipe does not exists.' })
      }
      else{
        await Recipe.findByIdAndDelete(recipe?._id);
        res.status(200).json({ message: 'Recipe deleted successfully.' });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });


  export default recipeRouter;