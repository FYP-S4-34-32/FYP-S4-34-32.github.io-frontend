//=============================//
// Handles changing password  //
//============================//

// imports
import { useState } from 'react'

export const useResetPassword = () => {
    const [resetPasswordError, setError] = useState(null)
    const [resetPasswordLoading, setIsLoading] = useState(null)
    const [resetPasswordSuccess, setSuccess] = useState(null)

    const resetPassword = async (email, token, newPassword, confirmPassword) => { 

        setIsLoading(true)  
        setError(null) 
 
        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/user/resetPassword', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, token, newPassword, confirmPassword})
        })

        const json = await response.json()

        if (!response.ok) { 
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) {
            setIsLoading(false)
            setSuccess(json.response)
        } 
    }

    return { resetPassword, resetPasswordLoading, resetPasswordError, resetPasswordSuccess}
}