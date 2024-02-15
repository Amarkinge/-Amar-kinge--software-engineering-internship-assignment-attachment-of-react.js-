export interface IFoodRecipeApiResponse {
    s: number;
    d: IFoodRecipe[];
    t: number;
    p: IPagesDetails;
}

interface IPagesDetails {
    limitstart: number;
    limit: number;
    total: number;
    pagesStart: number;
    pagesStop: number;
    pagesCurrent: number;
    pagesTotal: number;
}

export interface IFoodRecipe {
    id: string;
    Title: string;
    Ingredients: Ingredients;
    Instructions: string;
    Image: string;
}

type Ingredients = {
    [key: number]: string;
};
