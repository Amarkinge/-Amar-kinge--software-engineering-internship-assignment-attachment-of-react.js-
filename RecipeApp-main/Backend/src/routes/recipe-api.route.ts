import { Router, Request, Response } from 'express';
import * as RestAPI from "../services/recipe-api";

const recipeApiRouter = Router();

recipeApiRouter.get('/recipe', async (req: Request, res: Response) => {

    try {
        const searchQuery = String(req.query.searchTerm) || ' ';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10; // Default to 10 items per page

        if (!searchQuery) {
            return res.status(500).json({
                status: "failure",
                message: "No query parameter 'q' provided."
            });
        }
        const result = await RestAPI.searchFoodRecipes(searchQuery,page,limit);
        if(!result)
        {
            throw new Error(await result);
        }
        res.status(200).json(result);
    } catch (e: any) {
        const msg = JSON.parse(e);
        res.status(400).json({ message: msg.message});
    }

});

export default recipeApiRouter;