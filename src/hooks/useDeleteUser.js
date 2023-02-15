// ============================== //
// Handles DELETE user            //
// ============================== //

// imports
import { useState } from 'react'

export const useDeleteUser = () => {
    const [deleteUserError, setError] = useState(null)
    const [deleteUserIsLoading, setIsLoading] = useState(null)  
    const [deleteUserSuccess, setSuccess] = useState(null) 

    const deleteOneUser = async (email) => { 

        console.log("to delete user's userEmail: ", JSON.stringify({email}))
        setIsLoading(true)  
        setError(null) 


        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/user/deleteUser', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
        })

        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) { 
            setIsLoading(false) 
            setSuccess(json.deletedUser)
        } 
    }

    return { deleteOneUser, deleteUserIsLoading, deleteUserError, deleteUserSuccess}
}