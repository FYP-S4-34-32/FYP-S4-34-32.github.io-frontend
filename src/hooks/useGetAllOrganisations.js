//===============================//
// Handles GET all Organisations //
//===============================//

// imports
import { useState } from 'react'

export const useGetAllOrganisations = () => {
    const [getAllOrganisationsError, setError] = useState(null)
    const [getAllOrganisationsIsLoading, setIsLoading] = useState(null) 
    const [allOrganisations, setAllOrganisations] = useState([])

    const getAllOrganisations = async (user) => { 
        setIsLoading(true)  
        setError(null) 

        const response = await fetch('/api/organisation/', {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                      'Authorization': `Bearer ${ user.token}`  // sends authorisation header with the uer's token -> backend will validate token -> if valid, grant access to API
            }
        })

        const json = await response.json() 

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) { 
            setIsLoading(false)
            setAllOrganisations(json)
        }
    }

    return { getAllOrganisations, getAllOrganisationsError, getAllOrganisationsIsLoading, allOrganisations}
}