// imports
import { useAssignmentContext } from "../hooks/useAssignmentContext"
import { useAuthenticationContext } from "../hooks/useAuthenticationContext"

const { useState } = require("react")

const AssignmentForm = () => {
    const { dispatch } = useAssignmentContext()
    const { user } = useAuthenticationContext()
    
    const [title, setTitle] = useState('') // default value = empty
    const [start_date, setStartDate] = useState('') // default value = empty
    const [end_date, setEndDate] = useState('') // default value = empty
    const [threshold, setThreshold] = useState(0) // default = 0
    const [error, setError] = useState(null) // default value = no error

    // state for empty fields validation
    const [emptyFields, setEmptyFields] = useState([]) // empty array by default

    const handleSubmit = async (e) => { // will be reaching out to the api
        e.preventDefault() // prevent the page from refreshing upon submit

        // if there is no user object <- not logged in
        if (!user) {
            setError('You must be logged in')
            return
        }

        const { organisation_id, name: created_by } = user

        const assignment = { title, organisation_id, start_date, end_date, threshold, created_by }

        // fetch request to post new data
        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/assignment/', {
            method: 'POST',
            body: JSON.stringify(assignment), // send the assignment object
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ user.token }`
            }
        }) // this is where we send the post request

        const json = await response.json()

        // if response is NOT ok
        if (!response.ok) {
            setError(json.error)
            
            setEmptyFields(json.emptyFields)
        }

        // if response is OK
        if (response.ok) {
            setError(null) // in case there was an error previously
    
            // reset the form
            setTitle('')
            setStartDate('')
            setEndDate('')
            setThreshold(0)
            setEmptyFields([]) // reset the emptyfields array

            console.log("new assignment added", json)

            dispatch({ type: 'CREATE_ASSIGNMENT', payload: json })
        }
    }

    return (
        <form className="create-assignment" onSubmit={ handleSubmit }>
            <h3>Add a New Assignment</h3>

            <label>Assigment Title:</label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)} // value of the target(input field) of the event e
                value={title} // reflect changes made outside the form e.g. resetting the form into empty string
                className={ emptyFields.includes('title') ? 'error' : ''} // if empty, give it a className
            />

            <label>Start Date:</label>
            <input
                type="date"
                onChange={(e) => setStartDate(e.target.value)} // value of the target(input field) of the event e
                value={start_date} // reflect changes made outside the form e.g. resetting the form into empty string
                className={ emptyFields.includes('startDate') ? 'error' : ''} // if empty, give it a className
            />

            <label>End Date:</label>
            <input
                type="date"
                onChange={(e) => setEndDate(e.target.value)} // value of the target(input field) of the event e
                value={end_date} // reflect changes made outside the form e.g. resetting the form into empty string
                className={ emptyFields.includes('endDate') ? 'error' : ''} // if empty, give it a className
            />

            <label>Threshold:</label>
            <input
                type="number"
                onChange={(e) => setThreshold(e.target.value)} // value of the target(input field) of the event e
                value={threshold} // reflect changes made outside the form e.g. resetting the form into empty string
                className={ emptyFields.includes('threshold') ? 'error' : ''} // if empty, give it a className
            />

            <button>Add Assignment</button>
            { error && <div className="error">{ error }</div>} {/* output the error state if there is any */}
        </form>
    )
}

export default AssignmentForm