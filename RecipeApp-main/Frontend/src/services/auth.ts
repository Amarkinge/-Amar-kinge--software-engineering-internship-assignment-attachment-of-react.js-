import { LoginResponse, LoginRequest, RegisterRequest } from "../types";


//User Login  API
const login = async (req: LoginRequest): Promise<LoginResponse> => {
    try {

        const baseURL = new URL("http://localhost:3000/RecipeApp/api/v1/auth/login");

        const apiResponse = await fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        });

        if (!apiResponse.ok) {
            throw new Error(await apiResponse.text());
        }

        const res = apiResponse.text();  // The API response is a JSON object
        const data = await res.then((data) => JSON.parse(data));
        return data;

    }
    catch (e) {
        console.log("Error in Login: "+e);
        throw e;
    }
}

const register = async (req: RegisterRequest) => {
try {
    const baseURL = new URL("http://localhost:3000/RecipeApp/api/v1/auth/register");

    const apiResponse = await fetch(baseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req)
    });

    if (!apiResponse.ok) {
        throw new Error(await apiResponse.text());
    }
    else {
        const res = apiResponse.text();  // The API response is a JSON object
        const data = await res.then((data) => JSON.parse(data)) as LoginResponse;
        return data;
    }
} catch (e) {
    console.log("Error in user registration: "+e);
    throw e;
}
}

export {login, register};