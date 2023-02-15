//=======================================//
// Handles Changing Assignment Status   //
//======================================//

// imports
import { useState } from 'react'

export const useUpdateActiveStatus = () => {
    const [updateStatusError, setError] = useState(null)
    const [updateStatusIsLoading, setIsLoading] = useState(null)  

    const updateActiveStatus = async (user, id) => {  

        setIsLoading(true)  
        setError(null) 

        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/assignment/updateActiveStatus/' + id, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${ user.token}`},
            
        })

        const json = await response.json()  

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) { 
            setIsLoading(false) 
        }
    }

    return { updateActiveStatus, updateStatusIsLoading, updateStatusError}
}