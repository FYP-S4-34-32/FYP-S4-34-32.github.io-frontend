//==========================//
// Create Organization Page //
//==========================//

// imports
import { useAuthenticationContext } from "../hooks/useAuthenticationContext"
import { useNavigate } from "react-router-dom"

// import TextareaAutoSize from 'react-textarea-autosize'

const { useState } = require("react")

const CreateOrganisation = () => {
    const { user } = useAuthenticationContext()

    const [orgname, setOrgname] = useState('') // default value = empty
    const [organisation_id, setOrganisation_id] = useState('') // default value = empty
    const [detail, setDetail] = useState('') // default value = empty
    const [error, setError] = useState(null) // default value = empty

    const navigate = useNavigate()

    // state for empty fields validation
    const [emptyFields, setEmptyFields] = useState([]) // empty array by default

    const handleSubmit = async (e) => { // will be reaching out to the api
        e.preventDefault() // prevent the page from refreshing upon submit

        // if there is no user object <- not logged in
        if (!user) {
            setError('You must be logged in')
            return
        }

        // const organisation = { name, organisation_id, detail }
        const organisation = { orgname, organisation_id, detail }

        // fetch request to post new data
        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/organisation/createorganisation', {
            method: 'POST',
            body: JSON.stringify(organisation),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ user.token }`
            }
        }) // this is where we send the POST request
        const json = await response.json() // response will be retrieved from organisationController.createOrganisation

        // response NOT ok
        if (!response.ok) {
            setError(json.error) // the error property from organisationController.createOrganisation

            setEmptyFields(json.emptyFields)
        }

        // response OK
        if (response.ok) {
            setError(null) // in case there was an error previously
            
            // reset the form
            setOrgname('') // reset name
            setOrganisation_id('') // reset org organisation_id
            setDetail('') // reset description

            setEmptyFields([]) // reset the emptyfields array
            
            console.log('New Organisation Added')

            navigate('/') // navigate back to home page aka organistion listing page
        }
    }

    return(
        <div className="create">
            <h2>Add a new Organisation Listing</h2>

            <form onSubmit={ handleSubmit }>
            <label>Organisation Name:</label>
            <input 
                type="text"
                onChange={ (e) => setOrgname(e.target.value) } // value of the target(input field) of the event e
                value={ orgname } // reflect changes made outside the form e.g. resetting the form into empty string
                className={ emptyFields?.includes('orgname') ? 'error': '' } // if empty, give it a className
            />

            <label>Organisation Code:</label>
            <input 
                type="text"
                onChange={ (e) => setOrganisation_id(e.target.value) } // value of the target(input field) of the event e
                value={ organisation_id } // reflect changes made outside the form e.g. resetting the form into empty string
                className={ emptyFields?.includes('organisation_id') ? 'error': '' } // if empty, give it a className
            />

            <label>Organisation Description:</label>
            {/* {<TextareaAutoSize
                type="text"
                onChange={(e) => setDescription(e.target.value)} 
                value={description}
                className={ emptyFields.includes('description') ? 'error': ''}
            />} Planning to change to description attribute for org instead of detail */}
            <textarea
                type="text"
                onChange={(e) => setDetail(e.target.value)} 
                value={ detail }
                className={ emptyFields?.includes('detail') ? 'error': ''}
            />

            <button>Add New Organisation Listing</button>
            { error && <div className="error">{ error }</div> }
            </form>
        </div>
    )
}

export default CreateOrganisation