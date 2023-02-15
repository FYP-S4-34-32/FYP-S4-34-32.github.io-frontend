//===============================//
// Handles updating contact info //
//===============================//

// imports
import { useState } from 'react'

export const useUpdateInfo = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [updateContact, setUpdateContact] = useState(null)

    const updateInfo = async (email, contact) => { 
        setIsLoading(true)  
        setError(null) 

        const response = await fetch('/api/user/updateInfo', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, contact})
        })

        const json = await response.json()  

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) {
            setIsLoading(false)
            setUpdateContact(json.successMsg)
        }

        return json.user.contact
    }

    const resetError = () => {
        setError(null)
    }

    const resetUpdateContact = () => {
        setUpdateContact(null)
    }

    return { updateInfo, isLoading, error, updateContact, resetError, resetUpdateContact }
}