//======================//
// Assignment Lisiting //
//======================//

// imports
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useAuthenticationContext } from "../hooks/useAuthenticationContext"
import { Link } from "react-router-dom"
import { useAssignmentContext } from "../hooks/useAssignmentContext"


const AssignmentList = ({ assignment }) => {
    const { user } = useAuthenticationContext()
    const { dispatch } = useAssignmentContext()

    const sDate = new Date(assignment.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const eDate = new Date(assignment.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })

    const handleClick = async (e) => {
        e.preventDefault()

        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/assignment/' + assignment._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${ user.token }`
            }
        }) // make use of the parameter object

        const json = await response.json() // document of the object that was just deleted

        // response OK
        if (response.ok) {
            dispatch({ type: 'DELETE_ASSIGNMENT', payload: json })
        }

        // response NOT ok
        if (!response.ok) {
            console.log(json.error) // the error property
        }
    }

    

    return (
        <div className="project-list" key={ assignment._id }>
            <Link to={ `/assignment/${ assignment._id }` }>
                <h4>{ assignment.title }</h4>
                <p><strong>Projects: </strong>{ assignment.projects.length }</p>
                <p><strong>Employees: </strong>{ assignment.employees.length }</p>
                <p><strong>Threshold: </strong>{ assignment.threshold }</p>
                <p><strong>Start Date: </strong>{ sDate }</p>
                <p><strong>End Date: </strong>{ eDate }</p>
                <p><strong>Created by: </strong>{ assignment.created_by } { formatDistanceToNow(new Date(assignment.createdAt), { addSuffix: true }) }</p>
                <span className="material-symbols-outlined" onClick = { handleClick }>delete</span>
            </Link>
        </div>
    )
}

export default AssignmentList