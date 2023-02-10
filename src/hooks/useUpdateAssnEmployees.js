//=======================================//
// Handles updating assignment employees //
//======================================//

// imports
import { useState } from 'react'

export const useUpdateEmployees = () => {
    const [updateEmployeesError, setError] = useState(null)
    const [updateEmployeesIsLoading, setIsLoading] = useState(null)  

    const updateEmployees = async (user, id, employees) => {  

        setIsLoading(true)  
        setError(null) 

        const response = await fetch('/api/assignment/updateEmployees/' + id, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${ user.token}`},

            body: JSON.stringify({employees})
        })

        const json = await response.json()  

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) { 
            setIsLoading(false) 
        }
        
        console.log(json.assignment)
        return json.assignment
    }

    return { updateEmployees, updateEmployeesIsLoading, updateEmployeesError}
}