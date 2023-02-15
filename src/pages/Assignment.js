// ======================= //
// Assignment Listing Page //
// ======================= //

import { useAuthenticationContext } from '../hooks/useAuthenticationContext' 
import { useAssignmentContext } from '../hooks/useAssignmentContext'
import { useEffect } from 'react'
import AssignmentList from '../components/AssignmentList'
import AssignmentForm from '../components/AssignmentForm'

const Assignment = () => {

    const { user } = useAuthenticationContext() // get the user object from the context
    const { assignments, dispatch } = useAssignmentContext()
    
    useEffect(() => {
        const fetchAssignment = async () => {
            const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/assignment', {
                headers: {
                    'Authorization': `Bearer ${ user.token }` // sends authorisation header with the user's token -> backend will validate token -> if valid, grant access to API
                }
            }) // using fetch() api to fetch data ad store in the variable
            const json = await response.json() // response object into json object, in this case an array of assignment objects
            
            // response OK
            if (response.ok) {
                dispatch({ type: 'SET_ASSIGNMENTS', payload: json})
            }
        }

        // if there is an authenticated user
        if (user) {
            fetchAssignment()
        }
    }, [dispatch, user])

    return (
        <div className='assignment-home'> 
            <div className="assignments">
                <h2>Project Assignment</h2>
                { assignments && assignments.map((assignment) => ( // will only run when there is a assignment object
                    <AssignmentList key={ assignment._id } assignment={ assignment } /> // key must be unique
                ))}
            </div>  
            <AssignmentForm />
        </div>
    )
}

export default Assignment

