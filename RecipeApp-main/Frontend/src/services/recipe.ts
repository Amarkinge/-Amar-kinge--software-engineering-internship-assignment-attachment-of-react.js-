import { BookmarkResponse, FoodRecipe } from "../types";


//GET -Recipe By Bson object id.
export const getRecipeByObjectId = async (id: string, token: string) => {

    try {
        if (token == null || !token) {
            throw new Error("Authorization token is not available.");
        }

        if (id.length === 0) throw new Error("No user id provided");
        const baseURL = new URL(`http://localhost:3000/RecipeApp/api/v1/recipe/getByObjectId?recipeId=${id}`);

        const bookmarksResponse = await fetch(baseURL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!bookmarksResponse.ok){
            throw new Error(bookmarksResponse.statusText);
        }

        const response: FoodRecipe = JSON.parse(await bookmarksResponse.text() as string);
        return response;
    }
    catch (error: unknown) {
        console.log(error);
        throw error;
    }
}


//POST - Add Recipe in DB
export const addRecipeBookmark = async (payload: FoodRecipe, token: string) => {
    try {
        if (token == null || !token) {
            throw new Error("Authorization token is not available.");
        }
        if (!payload || payload == undefined || payload == null) throw new Error("Payload is empty or undefined.");
        console.log(payload);
        const baseURL = new URL('http://localhost:3000/RecipeApp/api/v1/recipe/add/');

        const bookmarksResponse = await fetch(baseURL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if(!bookmarksResponse.ok)
        {
            throw new Error(await bookmarksResponse.text());
        }

        const response: BookmarkResponse = JSON.parse(await bookmarksResponse.text()) as BookmarkResponse;
        return response;
    }
    catch (error: unknown) {
        console.log(error);
        throw error;
    }
}

export const deleteRecipeBookmark = async (recipeObjectId:string, token: string) => {
    try {
        if (token == null || !token) {
            throw new Error("Authorization token is not available.");
        }
        if (!recipeObjectId || recipeObjectId == undefined || recipeObjectId == null || recipeObjectId.length === 0)
         throw new Error("Recipe Object Id is empty or undefined.");

        const baseURL = new URL("http://localhost:3000/RecipeApp/api/v1/recipe/deleteByObjectId");

        baseURL.searchParams.append('recipeId', recipeObjectId);
        const bookmarksResponse = await fetch(baseURL, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if(!bookmarksResponse.ok)
        {
            throw new Error(await bookmarksResponse.text());
        }

        const response = JSON.parse(await bookmarksResponse.text());
        return response;
    }
    catch (error: unknown) {
        console.log(error);
        throw error;
    }
}

