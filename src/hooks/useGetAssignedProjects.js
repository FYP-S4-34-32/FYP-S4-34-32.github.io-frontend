//============================================================//
// Handles fetching of current  projects assigned to employee //
//============================================================//

// imports
import { useState } from 'react' 

export const useGetAssignedProjects = () => { 
    const [getAssignedProjectsError, setError] = useState(null)
    const [getAssignedProjectsIsLoading, setIsLoading] = useState(null)
    const [assignedProjects, setAssignedProjects] = useState([])

    const getAssignedProjects = async () => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/project/assignedProjects', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) {
            setIsLoading(false)
            setAssignedProjects(json)
        }
    }

    return { getAssignedProjects, getAssignedProjectsIsLoading, getAssignedProjectsError, assignedProjects}
}
