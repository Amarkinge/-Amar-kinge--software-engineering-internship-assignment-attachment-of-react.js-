/* eslint-disable @typescript-eslint/no-explicit-any */
import { FoodRecipeApiResponse } from "../types";


const getFoodRecipes = async (searchTerm: string, page: number, limit: number) => {

  try {

    const baseURL = new URL("http://localhost:3000/RecipeApp/api/v1/recipeapi/recipe/");

    baseURL.searchParams.set("searchTerm", searchTerm);
    baseURL.searchParams.set("page", page.toString());
    baseURL.searchParams.set("limit", limit.toString())

    const apiResponse = await fetch(baseURL.toString(), { method: "GET" });


    if (!apiResponse.ok) {
      throw new Error(await apiResponse.text());
    }

    const res = apiResponse.text();  // The API response is a JSON object
    const data = await res.then((data) => JSON.parse(data)) as Promise<FoodRecipeApiResponse>;
    return data;
  }
  catch (error: any) {
    throw error.message;
  }
}

export default getFoodRecipes;