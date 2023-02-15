//=================================//
// Handles updating user role info //
//=================================//

// imports
import { useState } from 'react'

export const useUpdateRole = () => {
    const [updateRoleError, setError] = useState(null)
    const [updateRoleIsLoading, setIsLoading] = useState(null)
    const [updateRoleSuccess, setSuccess] = useState(null)

    const updateRole = async (email, role) => { 

        setIsLoading(true)  
        setError(null) 

        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/user/updateRole', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, role})
        })

        const json = await response.json() 
        console.log(json)

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) {
            setIsLoading(false)
            setSuccess(json.successMsg)
        }

        return json.user.role
    }

    return { updateRole, updateRoleError, updateRoleIsLoading, updateRoleSuccess }
}
