//=============================//
// Handles changing password  //
//============================//

// imports
import { useState } from 'react'

export const useChangePassword = () => {
    const [changePwError, setError] = useState(null)
    const [changePwIsLoading, setIsLoading] = useState(null)
    const [changePwSuccess, setSuccess] = useState(null)

    const changePassword = async (email, currentPassword, newPassword, confirmPassword) => {
        // console.log(email, currentPassword, newPassword) 

        setIsLoading(true)  
        setError(null) 
 
        const response = await fetch('/api/user/changePassword', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, currentPassword, newPassword, confirmPassword})
        })

        const json = await response.json()


        if (!response.ok) { 
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) {
            setIsLoading(false)
            setSuccess(json.successMsg)
        } 
    }

    return { changePassword, changePwIsLoading, changePwError, changePwSuccess}
}