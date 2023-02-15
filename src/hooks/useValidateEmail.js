// =============================== //
// Sends POST request to backend to validate email
// =============================== //

// Path: Code/frontend/src/hooks/useValidateEmail.js

import { useState } from 'react'

export const useValidateEmail = () => {
    const [invalidEmailError, setInvalidEmailError] = useState(false)
    const [isValidationLoading, setIsValidationLoading] = useState(false)
    const [message, setMessage] = useState("")

    const validateEmail = async (email) => {
        setIsValidationLoading(true)
        setInvalidEmailError(null)  

        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/user/validateEmail', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
        })

        const json = await response.json()
        // console.log("json: ", json);

        if (!response.ok) {
            setIsValidationLoading(false)
            setInvalidEmailError(json.error)
        }

        if(response.ok) {
            setIsValidationLoading(false)  
            setMessage(json.response) 
        }
    }

    return { validateEmail, invalidEmailError, isValidationLoading, message }
} 