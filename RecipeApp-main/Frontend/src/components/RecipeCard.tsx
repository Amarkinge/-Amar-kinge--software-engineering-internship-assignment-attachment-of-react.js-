/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookmarkRequest, BookmarkResponse, FoodRecipe, Ingredients } from "../types";
import React, { useEffect } from "react";
import RecipeModal from "./RecipeModal";
import { addRecipeBookmark, deleteRecipeBookmark } from "../services/recipe";
import { addUserBookmark, deleteBookmarkByObjectId, getBookmarksByRecipe } from "../services/bookmarks";



interface Props {
    recipe: FoodRecipe;
    onBookmarked: (isBookmarked: boolean) => void;
    onUnBookmarked: (isUnBookmarked: boolean) => void;
    loginStatus: boolean;
}

const RecipeCard = ({ recipe, onBookmarked, onUnBookmarked, loginStatus }: Props) => {

    const [modalShow, setModalShow] = React.useState(false);
    const [selectedRecipe, setSelectedRecipe] = React.useState<FoodRecipe | null>(null);
    const bookmarks = JSON.parse(localStorage.getItem("userBookmarks") || '[]') as BookmarkResponse[];
    const bookmarkAvailableStatusRef = React.useRef(false);
    const [isBookmarked, setIsBookmarked] = React.useState(false); // State to track bookmark status

    useEffect(() => {
        setSelectedRecipe(recipe);
        bookmarkAvailableStatusRef.current = bookmarks.find(b => b.id === recipe.id) !== undefined;
        setIsBookmarked(bookmarkAvailableStatusRef.current && loginStatus);
    }, [bookmarks, loginStatus, recipe]);


    const addBookmarkInDb = async (recipeBookmark: FoodRecipe, userId: string, tkn: string) => {

        const resultAddRecipeBookmark = await addRecipeBookmark(recipeBookmark, tkn);
        if (resultAddRecipeBookmark) {

            const bookmarkPayload: BookmarkRequest = {
                recipeId: resultAddRecipeBookmark._id,
                userId: userId
            }

            const resultAddUserBookmark = await addUserBookmark(bookmarkPayload, tkn);

            if (resultAddUserBookmark) {
                bookmarks.push(resultAddRecipeBookmark);
                localStorage.setItem("userBookmarks", JSON.stringify(bookmarks));
                setIsBookmarked(true);
                bookmarkAvailableStatusRef.current = true;
                onBookmarked(true);

            }
            else {
                onBookmarked(false);
            }
        }
        else {
            onBookmarked(false);
        }
    }

    const removeBookmarkFromDb = async (recipeId: string, tkn: string) => {

        const bookmarkedRecipe = bookmarks.find(b => b.id == recipeId);
        if (bookmarkedRecipe) {
            const removeBookmarkResult = await deleteRecipeBookmark(bookmarkedRecipe._id, tkn);
            if (removeBookmarkResult) {
                const getUsrBookmarkResult = await getBookmarksByRecipe(bookmarkedRecipe._id, tkn);
                console.log(getUsrBookmarkResult);
                if (getUsrBookmarkResult) {
                    const result = await deleteBookmarkByObjectId(getUsrBookmarkResult[0]._id, tkn);
                    console.log(result);
                    const filteredBookmark = bookmarks.filter(b => b._id != bookmarkedRecipe._id);
                    localStorage.setItem("userBookmarks", JSON.stringify(filteredBookmark));
                    setIsBookmarked(false);
                    onUnBookmarked(true);
                }
                else {
                    onUnBookmarked(false);
                }
            }
            else {
                onUnBookmarked(false);
            }
        }


    }

    // Function to handle bookmark click
    const handleBookmarkClick = async (_recipe: FoodRecipe, hasToBookmark: boolean, e: any) => {
        //get bookmarks from  local storage and convert it into an object if not present or malformed
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId') || '';
            const token = localStorage.getItem("token") || '';
            if (loginStatus && userId.length !== 0 && token.length !== 0) {
                if (!bookmarkAvailableStatusRef.current && hasToBookmark) {
                    await addBookmarkInDb(_recipe, userId, token);
                }
                else if (bookmarkAvailableStatusRef && !hasToBookmark) {
                    await removeBookmarkFromDb(_recipe.id, token);
                }
            }
            else {
                alert("Please register or login.");
            }

        } catch (error: any) {
            const msg = JSON.parse(error.message);
            alert(msg.message);
        }
    };

    const handleShowSummary = async (recipe: FoodRecipe) => {
        setSelectedRecipe(recipe);
        setModalShow(true);
    };

    function createMarkup(ingredients: Ingredients) {
        let innerHtml = ``;
        for (const key in ingredients) {
            const value = ingredients[key]
            innerHtml += `<li className="list-group-item">${key}) ${value}</li>`;
        }
        return {
            __html: innerHtml
        };
    }
    return (
        <div>
            <div className="card" style={
                {
                    width: '25rem'
                }
            }>
                <img src={recipe.Image} className="card-img-top" alt="..." />
                <h4 className="card-title">{recipe.Title}</h4>
                <div className="card-body">
                    <strong className="card-subtitle">
                        Ingredients:
                    </strong>
                    <ul className="list-group list-group-flush" id="ingreList" dangerouslySetInnerHTML={createMarkup(recipe.Ingredients)}>
                    </ul>
                </div>
                <div className="card-header d-flex justify-content-between align-items-center">
                    <button
                        className="btn btn-primary"
                        onClick={() => { handleShowSummary(recipe) }}
                    >
                        Instructions
                    </button>
                    {
                        loginStatus
                            ? (
                                <div>
                                    {
                                        isBookmarked
                                            ? <i className="fa fa-solid fa-bookmark" onClick={(e) => handleBookmarkClick(recipe, false, e)}></i>
                                            : <i className="fa fa-regular fa-bookmark" onClick={(e) => handleBookmarkClick(recipe, true, e)}></i>
                                    }
                                </div>
                            ) :
                            (
                                <i className="fa-solid fa-info"></i>
                            )
                    }
                </div>
            </div>
            <RecipeModal
                recipe={selectedRecipe}
                show={modalShow}
                onHide={() => { setSelectedRecipe(null); setModalShow(false) }}
            />
        </div>
    );
};

export default RecipeCard;

