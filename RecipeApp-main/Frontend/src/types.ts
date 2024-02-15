
export interface FoodRecipe {
    id: string;
    Title: string;
    Ingredients: Ingredients;
    Instructions: string;
    Image: string;
}

export type Ingredients = {
    [key: string]: string;
};

export interface PagesDetails {
    limitstart: number;
    limit: number;
    total: number;
    pagesStart: number;
    pagesStop: number;
    pagesCurrent: number;
    pagesTotal: number;
}

export interface FoodRecipeApiResponse {
    s: number;
    d: FoodRecipe[];
    t: number;
    p: PagesDetails;
}


export interface LoginResponse{
    user: User;
    token:string;
}

export interface LoginRequest{
    emailOrPhone: string;
    password: string;
}

export interface RegisterRequest{
    name: string,
    email: string;
    password: string;
    phone: string;
}

export interface User{
    id: string;
    name: string;
}

export interface Bookmark {
    _id:string;
    user: string;
    recipe: string;
}

export interface ApiErrorResponse {
    message: string;
}

export interface BookmarkRequest {
    userId: string;
    recipeId: string;
}

export interface BookmarkResponse {
    _id: string;
    id: string;
    Title: string;
    Ingredients: Ingredients;
    Instructions: string;
    Image: string;
}