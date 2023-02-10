// ============================== //
// Handles DELETE users           //
// ============================== //

// imports
import { useState } from 'react'

export const useDeleteUsers = () => {
    const [deleteUsersError, setError] = useState(null)
    const [deleteUsersIsLoading, setIsLoading] = useState(null)  
    const [deleteUsersSuccess, setSuccess] = useState(null)
    //const [updatedAllUsers, setUpdatedAllUsers] = useState([])

    const deleteUsers = async (emails) => { 

        // console.log("to delete users Emails: ", JSON.stringify({emails}))
        setIsLoading(true)  
        setError(null)

        const response = await fetch('/api/user/deleteUsers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({emails})
        })

        const json = await response.json()

        // console.log("json: ", json)

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) {
            setIsLoading(false)
            setSuccess(json.deletedUsers)
            // setUpdatedAllUsers(json.users)
        }

        return json.users
    }

    return { deleteUsers, deleteUsersIsLoading, deleteUsersError, deleteUsersSuccess}
}