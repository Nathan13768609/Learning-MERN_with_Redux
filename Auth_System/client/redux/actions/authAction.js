export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAIL = 'REGISTER_USER_FAIL';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAIL = 'LOGIN_USER_FAIL';

const BASE_URL = 'http://192.168.20.47:3000';

    // actions handle the logic and the reducer updates the state with the new values

export const registerUser = (authData) => {
    const {fullName, email, password} = authData;

    return async dispatch => {

        // logic to make a post request to REGISTER the user
        const  result = await fetch(`${BASE_URL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password
            })
        });

        const resultData = await result.json();

        if(resultData.success) {
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: resultData,
            });
        } else {
            dispatch({
                type: REGISTER_USER_FAIL
            });
        }

        return resultData;
    }
}

export const loginUser = (authData) => {
    const {email, password} = authData;

    return async dispatch => {

        // logic to make a post request to LOGIN the user
        const  result = await fetch(`${BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const resultData = await result.json();

        if(resultData.success) {
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: resultData,
            });
        } else {
            dispatch({
                type: LOGIN_USER_FAIL
            });
        }
        
        return resultData;
    }
}