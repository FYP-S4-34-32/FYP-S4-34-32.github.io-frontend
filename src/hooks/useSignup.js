//========================//
// Handle Signup requests //
//========================//

// imports
import { useState } from 'react'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)

    const signup = async (name, email, password, confirmPassword, role, organisation_id) => {

        setIsLoading(true) // set loading state
        setError(null) // reset error to null in case there was one previously

        // fetch function calls the endpoint in the backend server
        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, // type of the data
            body: JSON.stringify({name, email, password, confirmPassword, role, organisation_id}) // sends {name,email, password, role} as the request body
        })

        const json = await response.json() // the return value we get back from the userController.js signup function {email, token, role}

        // if there is a problem
        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
            setSuccessMsg(null)
        }

        // if response is ok
        if(response.ok) {

            // set loading state back to false
            setIsLoading(false)
            setSuccessMsg(json.successMsg)
        }
    }

    return { signup, isLoading, error, successMsg }
}