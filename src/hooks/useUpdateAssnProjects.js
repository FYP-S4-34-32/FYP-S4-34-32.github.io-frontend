//=======================================//
// Handles updating assignment projects //
//======================================//

// imports
import { useState } from 'react'

export const useUpdateProjects = () => {
    const [updateProjectsError, setError] = useState(null)
    const [updateProjectsIsLoading, setIsLoading] = useState(null)  

    const updateProjects = async (user, id, projects) => {  

        setIsLoading(true)  
        setError(null) 

        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/assignment/updateProjects/' + id, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${ user.token}`},

            body: JSON.stringify({projects})
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

    return { updateProjects, updateProjectsIsLoading, updateProjectsError}
}