import { IFoodRecipe, IFoodRecipeApiResponse } from "../models/interfaces"

require('dotenv').config();
const xKey = process.env.X_RapidAPI_Key;
const xHost = process.env.X_RapidAPI_Host;


export const searchFoodRecipes = async (searchKey: string, page: number, limit: number) => {

    const url = new URL(`https://food-recipes-with-images.p.rapidapi.com?q=${searchKey}&limit=${limit * page}`);

    const headers = {
        'X-RapidAPI-Key': String(xKey),
        'X-RapidAPI-Host': String(xHost)
    }

    try {
        const response = await fetch(url, { method: "GET", headers: headers }) as Response;
        if (!response.ok) { throw new Error(await response.text()); }
        const result = await response.json() as IFoodRecipeApiResponse;

    if(result.p.limit > limit)
      {
        const recipes = result.d;
        const nextBatchResult = recipes.slice((page - 1) * limit, ((page - 1) * limit) + limit);
        const res: IFoodRecipeApiResponse = {
            s: result.s,
            d: nextBatchResult,
            t: result.t,
            p: {
                limitstart: (page-1) * limit + 1,
                limit: page * limit,
                total: parseInt(String(result.t)),
                pagesCurrent: page,
                pagesStart:result.p.pagesStart,
                pagesTotal: Math.ceil(result.t / limit),
                pagesStop: result.p.pagesStop
            }
        }

        return res;

    }
        return result;
    }
    catch (e: any) { throw e.message; }
};