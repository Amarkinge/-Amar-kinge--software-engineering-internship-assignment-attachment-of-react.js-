/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Spinner, Tab, Tabs, Toast } from "react-bootstrap";
import Pagination from "./Pagination";
import RecipeCard from "./RecipeCard";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FoodRecipe, PagesDetails } from "../types";
import getFoodRecipes from "../services/recipe-api";

interface Props {
    loginStatus: boolean;
}

const Home: React.FC<Props> = ({ loginStatus }) => {

    const recipeList = JSON.parse(localStorage.getItem("recipes") || '[]') as FoodRecipe[];
    const [searchTerm, setSearchTerm] = useState<string>(""); // initialize to an empty string instead of a space
    const [activeKey, setActiveKey] = useState('recipes'); // use activeKey instead of key to avoid conflicts with React's key prop
    const [isLoggedIn, setIsLoggedIn] = useState(loginStatus);
    const [bookmarks, setBookmarks] = useState<FoodRecipe[]>([]);
    const [recipes, setRecipes] = useState<FoodRecipe[]>(recipeList);
    const [showToast, setShowToast] = useState(false); // use showToast instead of show to avoid conflicts with React Bootstrap's Toast component
    const [toastMessage, setToastMessage] = useState('');
    const [pageDetails, setPageDetails] = useState<PagesDetails>({ limit: 10, limitstart: 0, pagesCurrent: 1, total: 10, pagesStart: 1, pagesStop: 10, pagesTotal: 1 });
    const [message, setMessage] = useState("");
    const [alertKey, setAlertKey] = useState<number>(0);
    const [alertVariant, setAlertVariant] = useState<string>("success");
    const [show, setShow] = useState(false);
    const perPageRef = useRef(10);
    const pageNumberRef = useRef(1);


    useEffect(() => {

        const fetchData = async (key: string) => {
            try {
                const result = await getFoodRecipes(key, pageNumberRef.current, perPageRef.current);
                setRecipes(result.d);
                setPageDetails(result.p);
                pageNumberRef.current = result.p.pagesCurrent;
                localStorage.setItem("recipes", JSON.stringify(result.d));
                localStorage.setItem("pageDetails", JSON.stringify(result.p));

            } catch (error: any) {
                const msg = JSON.parse(error);
                setToastMessage(msg.message);
                setShowToast(true);
            }

        };

        setIsLoggedIn(loginStatus);
        if (recipes.length == 0 && searchTerm.length == 0) {
            fetchData(searchTerm);
        }
        else if (searchTerm.length > 0) {
            fetchData(searchTerm);
        }
        const userBookmarks = JSON.parse(localStorage.getItem("userBookmarks") || '[]') as FoodRecipe[];
        if (userBookmarks.length !== 0) {
            setBookmarks(userBookmarks);
        }

    }, [loginStatus, recipes.length, searchTerm]);


    const handlePageChange = async (pageNumber: number) => {
        try {
            const fetchedRecipes = await getFoodRecipes(searchTerm, pageNumber, perPageRef.current);
            setRecipes(fetchedRecipes.d);
            setPageDetails(fetchedRecipes.p);
            pageNumberRef.current = pageNumber;
        } catch (error: any) {
            const msg = JSON.parse(error);
            setToastMessage(msg.message);
            setShowToast(true);
        }
    };


    const handleTabChange = (key: string) => {
        setActiveKey(key);
    };


    const handleBookmarking = (status: boolean) => {
        if (status) {
            window.location.reload();
            setActiveKey('recipes');
            setMessage("Bookmark Saved Successfully!");
            setAlertKey(1);
            setAlertVariant("success");
        } else {
            setMessage("Bookmark Save Failed!");
            setAlertKey(1);
            setAlertVariant("danger");
        }
        setShow(true);
    }

    const handleUnBookmarking = (status: boolean) => {
        if (status) {
            window.location.reload();
            setActiveKey('bookmarks');
            setMessage("Bookmark Removed Successfully!");
            setAlertKey(1);
            setAlertVariant("success");  
        } else {
            setMessage("Removing bookmark failed!");
            setAlertKey(1);
            setAlertVariant("danger");
        }
        setShow(true);
    }

    const searchSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSearchTerm(searchTerm);
        pageNumberRef.current = 1; // reset page number when searching
    }

    return (
        <div className="container-fluid">
            <div>
                <Toast
                    style={{
                        position: 'fixed',
                        top: '100px',
                        right: 0,
                        backgroundColor: 'aliceblue',
                        zIndex: 2,
                    }}
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={4000}
                    autohide
                >
                    <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                        <strong className="mr-auto text-center">Message</strong>
                    </Toast.Header>
                    <Toast.Body className="text-black">{toastMessage}</Toast.Body>
                </Toast>
            </div>
            <div className="mt-2">
                <form className="d-flex" role="search" onSubmit={(e) => searchSubmit(e)}>
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={(e) => setSearchTerm(e.target.value)} />
                    <button className="btn btn-success" type="submit">Search</button>
                </form>
                {show && alertKey !== 0 &&
                    (
                        <Alert key={alertKey}
                            variant={alertVariant}
                            onClick={() => {
                                setShow(false);
                                setAlertKey(0);
                                setAlertVariant("");
                            }}
                            show={show}
                            dismissible>
                            {message}
                        </Alert>
                    )
                }
            </div>
            {
                isLoggedIn
                    ? (
                        <Tabs
                            id="controlled-tab"
                            activeKey={activeKey}
                            onSelect={(k) => handleTabChange(k || 'recipes')}
                        >
                            <Tab eventKey="recipes" title="Recipes">
                                <div className="recipe-list">
                                    {recipes?.length > 0
                                        ? (recipes.map((recipe: FoodRecipe) => (
                                            <RecipeCard
                                                key={recipe.id}
                                                recipe={recipe}
                                                onBookmarked={(s) => handleBookmarking(s)}
                                                onUnBookmarked={(s) => handleUnBookmarking(s)}
                                                loginStatus={isLoggedIn}
                                            >
                                            </RecipeCard>
                                        ))
                                        )
                                        : (<Spinner animation="border" variant="primary"></Spinner>)
                                    }
                                </div>
                                <div className="d-flex justify-content-center mt-2">
                                    {
                                        recipes.length > 0 ?
                                            (

                                                <Pagination
                                                    pages={pageDetails}
                                                    currentPage={pageNumberRef.current}
                                                    onPageChange={handlePageChange}
                                                />

                                            ) :
                                            (
                                                <span />
                                            )
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="bookmarks" title="Bookmarks">
                                {
                                    bookmarks.length > 0 ?
                                        (
                                            <div className="bookmark-list">
                                                {
                                                    bookmarks.map((recipe: FoodRecipe) => (
                                                        <RecipeCard
                                                            key={recipe.id}
                                                            recipe={recipe}
                                                            onBookmarked={(s) => handleBookmarking(s)}
                                                            onUnBookmarked={(s) => handleUnBookmarking(s)}
                                                            loginStatus={isLoggedIn}
                                                        ></RecipeCard>
                                                    ))
                                                }
                                            </div>
                                        ) :
                                        (<p>Bookmarks Not Found. Please add some to get started!</p>)
                                }
                            </Tab>
                        </Tabs>
                    ) :
                    (
                        <Tabs
                            id="controlled-tab"
                            activeKey={activeKey}
                            onSelect={(k) => setActiveKey(k ?? "recipes")}
                        >
                            <Tab eventKey="recipes" title="Recipes">
                                <div className="recipe-list">
                                    {recipes?.length > 0
                                        ? (
                                            recipes.map((recipe) => (
                                                <RecipeCard
                                                    key={recipe.id}
                                                    recipe={recipe}
                                                    onBookmarked={(s) => handleBookmarking(s)}
                                                    onUnBookmarked={(s) => handleUnBookmarking(s)}
                                                    loginStatus={isLoggedIn}
                                                >
                                                </RecipeCard>))
                                        )
                                        : <Spinner animation="border" variant="primary"></Spinner>
                                    }
                                </div>
                                <div className="d-flex justify-content-center mt-2">
                                    {
                                        recipes.length > 0 ?
                                            (

                                                <Pagination
                                                    pages={pageDetails}
                                                    currentPage={pageNumberRef.current}
                                                    onPageChange={handlePageChange}
                                                />

                                            ) :
                                            (
                                                <span />
                                            )
                                    }
                                </div>
                            </Tab>
                        </Tabs>
                    )
            }

        </div>
    );
}


export default Home;