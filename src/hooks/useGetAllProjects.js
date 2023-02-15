//===============================//
// Handles GET all Projects info //
//===============================//

// imports
import { useState } from 'react'

export const useGetAllProjects = () => {
    const [getAllProjectsError, setError] = useState(null)
    const [getAllProjectsIsLoading, setIsLoading] = useState(null) 
    const [allProjects, setAllProjects] = useState([])

    const getAllProjects = async (user) => { 
        setIsLoading(true)  
        setError(null) 

        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/project/', {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                      'Authorization': `Bearer ${user.token}`  // sends authorisation header with the uer's token -> backend will validate token -> if valid, grant access to API
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) { 
            setIsLoading(false)
            setAllProjects(json)
        }

        //console.log("all projects: ", json)

        return allProjects;
    }

    return { getAllProjects, getAllProjectsIsLoading, getAllProjectsError, allProjects}
}