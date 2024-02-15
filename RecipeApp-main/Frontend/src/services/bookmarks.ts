import { Bookmark, BookmarkRequest } from "../types";


export const getBookmarksByUser = async (userId: string, token: string): Promise<Bookmark[]> => {
    try {
        if (token == null || !token) {
            throw new Error("Authorization token is not available.");
        }

        if (userId.length === 0) {
            throw new Error("No user id provided");
        }


        const baseURL = new URL(`http://localhost:3000/RecipeApp/api/v1/bookmark/user/${userId}`);

        const bookmarksResponse = await fetch(baseURL, {
            method: 'GET', headers:
            {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await bookmarksResponse.text();
        const response: Bookmark[] = JSON.parse(result);
        return response;
    }
    catch (error: unknown) {
        console.log(error);
        throw error;
    }
}



export const getBookmarksByRecipe = async (recipeId: string, token: string): Promise<Bookmark[]> => {
    try {
        if (token == null || !token) {
            throw new Error("Authorization token is not available.");
        }

        if (recipeId.length === 0) {
            throw new Error("No recipe id provided");
        }


        const baseURL = new URL(`http://localhost:3000/RecipeApp/api/v1/bookmark/recipe/${recipeId}`);

        const bookmarksResponse = await fetch(baseURL, {
            method: 'GET', headers:
            {
                Authorization: `Bearer ${token}`
            }
        });


        if(!bookmarksResponse.ok)
        {
            throw new Error(await bookmarksResponse.text());
        }

        const result = await bookmarksResponse.text();
        const response: Bookmark[] = JSON.parse(result);
        return response;
    }
    catch (error: unknown) {
        console.log(error);
        throw error;
    }
}


export const addUserBookmark = async (payload: BookmarkRequest, token: string): Promise<Bookmark> => {
    try {
        if (token == null || !token) {
            throw new Error("Authorization token is not available.");
        }

        if (payload.userId.length === 0) {

            throw new Error("No user id provided");
        }

        if (payload.recipeId.length === 0) {
            throw new Error("No recipe id provided");
        }


        const baseURL = new URL(`http://localhost:3000/RecipeApp/api/v1/bookmark/add/`);

        const bookmarksResponse = await fetch(baseURL, {
            method: 'POST',
            headers:
            {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        const result = await bookmarksResponse.text();
        const response: Bookmark = JSON.parse(result);
        return response;
    }
    catch (error: unknown) {
        console.log(error);
        throw error;
    }
}

export const deleteBookmarkByObjectId = async (bookmarkId: string, token: string) => {
    try {
        if (token == null || !token) {
            throw new Error("Authorization token is not available.");
        }

        if (bookmarkId.length === 0) {
            throw new Error("No bookmakr id provided.");
        }


        const baseURL = new URL(`http://localhost:3000/RecipeApp/api/v1/bookmark/delete/${bookmarkId}`);

        const bookmarksResponse = await fetch(baseURL, {
            method: 'DELETE', headers:
            {
                Authorization: `Bearer ${token}`
            }
        });


        if(!bookmarksResponse.ok)
        {
            throw new Error(await bookmarksResponse.text());
        }
        const result = await bookmarksResponse.text();
        return JSON.parse(result);
    }
    catch (error: unknown) {
        console.log(error);
        throw error;
    }
}

