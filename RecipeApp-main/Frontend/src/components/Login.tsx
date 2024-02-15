/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Bookmark, FoodRecipe, LoginRequest, User } from '../types';
import { login } from '../services/auth';
import {getRecipeByObjectId} from '../services/recipe';
import {getBookmarksByUser} from '../services/bookmarks';
import { Link } from 'react-router-dom';

interface Props {
    onLogggedIn: (loginStatus: boolean, user: User) => void;
}

const Login: React.FC<Props> = ({ onLogggedIn }) => {

    const [message, setMessage] = React.useState("");
    const [alertKey, setAlertKey] = React.useState<number>(0);
    const [alertVariant, setAlertVariant] = React.useState<string>("success");
    const [show, setShow] = React.useState(false);
    const [emailOrPhone, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const userLoginStatusRef = useRef(false);

    const loadUserBookmarks = async (userId: string, authToken: string) => {
        try {
            //const userId = String(localStorage.getItem("userId"));
            const bookmarks = await getBookmarksByUser(userId, authToken) as Bookmark[];
            if (!bookmarks) {
                throw new Error("No Bookmarks Found for this User.");
            }
            //get all recipe Ids associated to user bookmarks
            const recipeIds: string[] = [];
            bookmarks.forEach((element: Bookmark) => {
                recipeIds.push(element.recipe);
            });
            //get Recipe (e.g user bookmark) for each recipe Id
            var newRecipes: FoodRecipe[] = [];
            for (let i = 0; i < recipeIds.length; i++) {
                const recipeById: FoodRecipe = await getRecipeByObjectId(recipeIds[i], authToken) as FoodRecipe;
                //newRecipes = [...newRecipes , recipeById];
                newRecipes.push(recipeById);
            }
            return newRecipes;
        }
        catch (e: any) {
            console.error(e);
            setMessage(e.message.toString());
            setAlertVariant("danger");
            setAlertKey(1);
            setShow(true);
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailOrPhone || !password) {
            alert("Please enter both Email/Phone and password");
            return false;
        }
        try {
            const request: LoginRequest = {
                emailOrPhone: emailOrPhone,
                password: password
            };
            const data = await login(request);
            if (data) {
               
                setMessage("User logged in sucessfully! Click on Home tab.");
                setAlertVariant("success");
                setAlertKey(1);
                setShow(true);
                userLoginStatusRef.current = true;
                onLogggedIn(true, data.user);
                localStorage.setItem("token", data.token);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userId", data.user.id);
                localStorage.setItem("user", JSON.stringify(data.user));
                const bookmarks = localStorage.getItem("userBookmarks");
                if (bookmarks == null || JSON.parse(bookmarks).length === 0) {
                    const userBookmarks = await loadUserBookmarks(data.user.id, data.token) as FoodRecipe[];
                    if (userBookmarks) {
                        localStorage.setItem("userBookmarks", JSON.stringify(userBookmarks));
                    }
                }

                // navigate("/");
            }
            else {
                setMessage("Something went wrong!");
                setAlertVariant("danger");
                setAlertKey(1);
                setShow(true);
            }
        }
        catch (error: any) {
            const msg = JSON.parse(error.message);
            setMessage(msg.message.toString());
            setAlertVariant("danger");
            setAlertKey(1);
            setShow(true);
        }
    };

    return (
        <>
            <div className='container'>
                <div className='card mb-lg-3'>
                    <div className="card-body">
                        <div className="pt-4 pb-2">
                            <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                            <p className="text-center small">Enter your Email or Phone & password to login</p>
                        </div>
                        <div className="pt-4 pb-2">
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
                                )}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group col-12">
                                <div className='input-group'>
                                    <span className="input-group-text" id="inputGroupPrepend"><i className="fa fa-user"></i></span>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="exampleInputEmail1"
                                        placeholder="Enter email or phone"
                                        value={emailOrPhone}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required />
                                </div>
                            </div>
                            <div className="form-group col-12">
                                <div className='input-group has-validation'>
                                    <span className="input-group-text" id="inputGroupPrepend"><i className="fa fa-lock"></i></span>
                                    <input
                                        type="password"
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control form-control-sm"
                                        id="exampleInputPassword1"
                                        required />
                                </div>
                            </div>
                            <div className="form-group col-12">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="rememberMe" value="true" id="rememberMe" />
                                    <label className="form-check-label" htmlFor="rememberMe">Remember me!</label>
                                </div>
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary w-100" type="submit">Login</button>
                            </div>
                            <div className="col-12">
                                <p className="small mb-0">Don't have account? <Link to="/register">Create an Account</Link></p>
                            </div>
                        </form>
                    </div>
                </div >
            </div >
        </>
    );
};

export default Login;
