//======================================================//
// Wraps our App component in an Authentication Context //
//======================================================//

// imports
import { createContext, useReducer, useEffect } from 'react'
import jwtDecode from 'jwt-decode'

// create authentication context
export const AuthenticationContext = createContext()

export const authenticationReducer = (state, action) => {
    // login/logout case
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload } 
        case 'LOGOUT':
            return { user: null } // remove user object
        default:
            return state // returns original state
    }
}

// wrapper
export const AuthenticationContextProvider = ({ children }) => {
    // register state
    const [state, dispatch] = useReducer(authenticationReducer, {
        user: null // user not logged in by default
    })

    // check local storage for any logged in user once component renders
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')) // localStorage is in JSON string, to be converted to be used as a JS object
        
        if (user) {
            const token = user.token

            // check if token has expired
            const isTokenExpired = (token) => {
                // decode the token to get its payload
                const payload = jwtDecode(token)

                // check if the token has expired by comparing the current time to the token's expiry time
                const now = Date.now() / 1000
                return now > payload.exp
            }
            
            // if user is logged in, and token has not expired
            if (!isTokenExpired(token)) {
                dispatch({ type: 'LOGIN', payload: user })
            }
        }
    }, []) // runs once

    console.log('AuthenticationContext state: ', state) // logs any changes to the state

    // wraps children component(s)
    return (
        <AuthenticationContext.Provider value={{...state, dispatch}}> {/* ...state returns the properties in line 27 onwards, BUT in this case only user */}
            { children }
        </AuthenticationContext.Provider>
    )
}