//=============================//
// Handles GET all users info //
//=============================//

// imports
import { useState } from 'react'

export const useGetAllUsers = () => {
    const [getAllUsersError, setError] = useState(null)
    const [getAllUsersIsLoading, setIsLoading] = useState(null) 
    const [allUsers, setAllUsers] = useState([])

    const getAllUsers = async () => { 
        setIsLoading(true)  
        setError(null) 

        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/user/allProfile', {
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
            setAllUsers(json)
        }

        //console.log("all users: ", json)

        return allUsers;
    }

    return { getAllUsers, getAllUsersIsLoading, getAllUsersError, allUsers}
}