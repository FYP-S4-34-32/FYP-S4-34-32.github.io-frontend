//=======================//
// Handle Login requests //
//=======================//


// imports
import { useState } from 'react'
import { useAuthenticationContext } from './useAuthenticationContext'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthenticationContext()

    const login = async (email, password) => {
        setIsLoading(true) // set loading state
        setError(null) // reset error to null in case there was one previously

        // fetch function calls the endpoint in the backend server
        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, // type of the data
            body: JSON.stringify({email, password}) // sends {email, password} as the request body
        })

        const json = await response.json() // the return value we get back from the userController.js login function

        // if there is a problem
        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        // if response is ok
        if(response.ok) {
            // save the user(jsonwebtoken) to local storage
            localStorage.setItem('user', JSON.stringify(json)) // {email, token, role}

            // update authentication context
            dispatch({type: 'LOGIN', payload: json})

            // set loading state back to false
            setIsLoading(false)
        }
    }

    return { login, isLoading, error }
}