//========================================//
// Handles Automatic Assignment Function  //
//========================================//

// imports
import { useState } from 'react'

export const useAutomaticAssignment = () => {
    

    const automaticAssignment = async (user, id) => {  


        let automaticAssignmentError = null
        let automaticAssignmentIsLoading = true

        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/assignment/autoAssign/' + id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${ user.token}`},
            
        })

        const json = await response.json()  

        if (!response.ok) {
            automaticAssignmentIsLoading = false
            automaticAssignmentError = json.error
        }

        if(response.ok) { 
            automaticAssignmentIsLoading = false
        }
        return {automaticAssignmentError, automaticAssignmentIsLoading}
    }

    return { automaticAssignment }
}