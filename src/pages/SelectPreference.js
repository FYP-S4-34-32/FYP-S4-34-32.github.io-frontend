//===========================//
// Preference Selection Page //
//===========================//

// imports 
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthenticationContext } from '../hooks/useAuthenticationContext' 
import { useProjectsContext } from "../hooks/useProjectsContext"

const SelectPreference = () => {
    // hooks
    const { user } = useAuthenticationContext()

    // get the list of available project
    const { projects, dispatch } = useProjectsContext()

    const [userProjects, setUserProjects] = useState([]) // default value = empty array
    const [firstChoice, setFirstChoice] = useState('') // default value = empty
    const [secondChoice, setSecondChoice] = useState('') // default value = empty
    const [thirdChoice, setThirdChoice] = useState('') // default value = empty
    const [error, setError] = useState(null) // default value = no error

    const navigate = useNavigate()

    // state for empty fields validation
    const [errorFields, setErrorFields] = useState([]) // empty array by default

    // fires when component is rendered
    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('/api/project', {
                headers: {
                    'Authorization': `Bearer ${ user.token }` // sends authorisation header with the uer's token -> backend will validate token -> if valid, grant access to API
                }
            }) // using fetch() api to fetch data ad store in the variable
            const json = await response.json() // response object into json object, in this case an array of project objects

            // get projects based on matching organisation_id with the user
            for (var i = 0; i < json.length; i++) {
                if (json[i].organisation_id !== user.organisation_id) {
                    json.splice(i, 1)
                    i--;
                }
            }

            // response OK
            if (response.ok) {
                dispatch({ type: 'SET_PROJECTS', payload: json})
            }

            const p = []

            for (var i = 0; i < json.length; i++) {
                const { assignment } = json[i]

                if (assignment === user.current_assignment) {
                    p.push(json[i])
                }
            }
            setUserProjects(p)
        }

        // if there is an authenticated user
        if (user) {
            fetchProjects()
        }
    }, [dispatch, user])


    // authorisation check
    if (!user && user.role !== 'Employee') {
        setError("You are not authorised to view this resource")
        return
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const email = user.email
        const projectPreference = { email, firstChoice, secondChoice, thirdChoice }

        // fetch request to post new data
        const response = await fetch('/api/user/selectpreference', {
            method: 'PATCH',
            body: JSON.stringify(projectPreference),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ user.token }`
            }
        }) // this is where we send the PATCH request
        
        const json = await response.json()

        // response NOT ok
        if (!response.ok) {
            setError(json.error) // the error property

            setErrorFields(json.errorFields)
        }

        // response OK
        if (response.ok) {
            setError(null) // in case there was an error previously
            
            // reset the form
            setFirstChoice('') // reset first choice
            setSecondChoice('') // reset second choice
            setThirdChoice('') // reset third choice

            setErrorFields([]) // reset the emptyfields array

            navigate('/projects') // navigate back to project listing page
        }
    }
    

    // return a template
    return ( 
        <div className="create"> 
            <h2>Input/Update Project Preference</h2>
            <form onSubmit={ handleSubmit }>
                <label>First Choice:</label>
                <select value={ firstChoice } onChange={(e) => { setFirstChoice(e.target.value) }} className={ errorFields.includes('firstChoice') ? 'error': '' }>
                    <option value="">Please choose one</option> {/* included this so that user will be forced to make a selection otherwise function returns role=null */}
                    { userProjects?.map(p => (
                        (p.active === true && <option key={ p.title } value={ p.title }>{ p.title }</option>)
                    )) }
                </select>
                
                <br></br><br></br><br></br>
                
                <label>Second Choice:</label>
                <select value={ secondChoice } onChange={(e) => { setSecondChoice(e.target.value) }} className={ errorFields.includes('secondChoice') ? 'error': '' }>
                    <option value="">Please choose one</option> {/* included this so that user will be forced to make a selection otherwise function returns role=null */}
                    { userProjects?.map(p => (
                        (p.active === true && <option key={ p.title } value={ p.title }>{ p.title }</option>)
                    )) }
                </select>
                
                <br></br><br></br><br></br>
                
                <label>Third Choice:</label>
                <select value={ thirdChoice } onChange={(e) => { setThirdChoice(e.target.value) }} className={ errorFields.includes('thirdChoice') ? 'error': '' }>
                    <option value="">Please choose one</option> {/* included this so that user will be forced to make a selection otherwise function returns role=null */}
                    { userProjects?.map(p => (
                        (p.active === true && <option key={ p.title } value={ p.title }>{ p.title }</option>)
                    )) }
                </select>

                <br></br><br></br><br></br>

                <button>Submit Selection</button>
                { error && <div className="error">{ error }</div> }
            </form>
        </div>
    )
}

export default SelectPreference