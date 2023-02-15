//=====================//
// Create Project Page //
//=====================//

// imports
import { useAuthenticationContext } from "../hooks/useAuthenticationContext"
import { useNavigate } from "react-router-dom"
import { useGetOrganisationSkills } from '../hooks/useGetOrgSkills'
const { useState, useEffect } = require("react")

const CreateProject = () => {
    const { user } = useAuthenticationContext()

    const [title, setTitle] = useState('') // default value = empty
    const [description, setDescription] = useState('') // default value = empty
    const [requirements, setRequirements] = useState('') // default value = empty
    const [threshold, setThreshold] = useState(null) // default value = empty
    const [error, setError] = useState(null) // default value = no error

    // handle adding skills to project
    const { getOrganisationSkills, allSkills } = useGetOrganisationSkills(); // fetch all skills defined for the organisation
    const [skills, setSkills] = useState([]) // all available skills
    const competency = ["Beginner", "Intermediate", "Advanced"] // the three levels of skill competency
    const [selectFields, setSelectFields] = useState([])
    const [projectSkills, setProjectSkills] = useState([]) // array to store skills selected
    const [projectCompetency, setProjectCompetency] = useState([]) // array to store competency level selected

    const navigate = useNavigate()

    // state for empty fields validation
    const [emptyFields, setEmptyFields] = useState([]) // empty array by default

    useEffect(() => {
        getOrganisationSkills(user.organisation_id)
    }, [])


    // // fires when component is rendered
    // useEffect(() => {
    //     const fetchSkills = async () => {
    //         const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/skill/', {
    //             headers: {
    //                 'Authorization': `Bearer ${ user.token }` // sends authorisation header with the uer's token -> backend will validate token -> if valid, grant access to API
    //             }
    //         }) // using fetch() api to fetch data and store in the variable
    //         const json = await response.json() // response object into json object, in this case an array of skills objects
    //         console.log(json)

    //         // response OK
    //         if (response.ok) {
    //             setSkills(json)
    //         }
    //     }

    //     // if there is an authenticated user
    //     if (user && user.role === "Admin") {
    //         fetchSkills()
    //     } else {
    //         navigate('/')
    //     }
    // }, [user, navigate])

    const handleSubmit = async (e) => { // will be reaching out to the api
        e.preventDefault() // prevent the page from refreshing upon submit

        // if there is no user object <- not logged in
        if (!user) {
            setError('You must be logged in')
            return
        }

        const project = { title, description, requirements, projectSkills, projectCompetency, threshold }

        // fetch request to post new data
        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/project/createproject', {
            method: 'POST',
            body: JSON.stringify(project),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ user.token }`
            }
        }) // this is where we send the POST request
        const json = await response.json() // response will be retrieved from projectController.createProject

        // response NOT ok
        if (!response.ok) {
            setError(json.error) // the error property from projectController.createProject

            setEmptyFields(json.emptyFields)
        }

        // response OK
        if (response.ok) {
            setError(null) // in case there was an error previously
            
            // reset the form
            setTitle('') // reset title
            setDescription('') // reset description
            setRequirements('') // reset requirements
            setProjectSkills([]) // reset skills
            setProjectCompetency([]) // reset competency
            setThreshold(null) // reset threshold

            setEmptyFields([]) // reset the emptyfields array
            
            console.log('New Project Added')

            navigate('/') // navigate back to home page aka project listing page
        }
    }

    // add field
    const handleAddField = () => {
        // pushes another element to the array with a unique id
        setSelectFields([...selectFields, { id: Date.now() }])

        // set dummy skill and competency value
        setProjectSkills([...projectSkills, "dummy"])
        setProjectCompetency([...projectCompetency, "dummy"])
    }

    // remove field
    const handleRemoveField = (id) => {

        // remove from projectSkills array
        projectSkills.splice(selectFields.findIndex(x => x.id === id), 1)

        // remove from projectCompetency array
        projectCompetency.splice(selectFields.findIndex(x => x.id === id), 1)

        // remove from selectFields array
        setSelectFields(selectFields.filter((field) => field.id !== id))
    }

    // handle adding skill to temporary array
    const addProjectSkills = (index, value) => {
        projectSkills[index] = value
    }

    // handle adding competency to temporary array
    const addProjectCompetency = (index, value) => {
        projectCompetency[index] = value
    }

    return(
        <div className="create">
            <h2>Add a new Project Listing</h2>

            <form onSubmit={ handleSubmit }>
            <label>Project Title:</label>
            <input 
                type="text"
                onChange={ (e) => setTitle(e.target.value) } // value of the target(input field) of the event e
                value={ title } // reflect changes made outside the form e.g. resetting the form into empty string
                className={ emptyFields?.includes('title') ? 'error': '' } // if empty, give it a className
            />

            <label>Project Description:</label>
            <textarea
                type="text"
                onChange={(e) => setDescription(e.target.value)} 
                value={description}
                className={ emptyFields?.includes('description') ? 'error': ''}
            />

            <label>Project Requirements:</label>
            <textarea
                type="text"
                onChange={(e) => setRequirements(e.target.value)} 
                value={requirements}
                className={ emptyFields?.includes('requirements') ? 'error': ''}
            />

            <label>Skills Required:</label>
            { selectFields.map((field) => (
                <div key={ field.id }>
                    <select 
                        value={ projectSkills[projectSkills.length] }
                        onChange={(e) => addProjectSkills(selectFields.findIndex(x => x.id === field.id), e.target.value)}
                        className={ (emptyFields?.includes('noSkill') || emptyFields?.includes('skillError')) ? 'error' : '' }
                        >
                        <option value="dummy">Please select a skill</option> {/* included this so that user will be forced to make a selection */}
                        { allSkills?.map(s => (
                            <option key={ s.skillName } value={ s.skillName }>{ s.skillName }</option>
                        )) }
                    </select>
                    <select
                        value={ projectCompetency[projectCompetency.length] }
                        onChange={(e) => addProjectCompetency(selectFields.findIndex(x => x.id === field.id), e.target.value)}
                        className={ (emptyFields?.includes('noSkill') || emptyFields?.includes('skillError')) ? 'error' : '' }
                        >
                        <option value="dummy">Please select a competency level</option> {/* included this so that user will be forced to make a selection */}
                        { competency.map(c => (
                            <option key={ c } value={ c }>{ c }</option>
                        )) }
                    </select>
                    <span className="material-symbols-outlined" onClick = {() => handleRemoveField(field.id) }>delete</span>
                </div>
            )) }
            <button className={ emptyFields?.includes('noSkill') ? 'error' : '' } type="button" onClick={ handleAddField }>Add Skills</button>
            <br></br><br></br>

            <label>Number of People Needed:</label>
            <input 
                type="number"
                onChange={ (e) => setThreshold(e.target.value) }
                defaultValue={0}
                className={ emptyFields?.includes('threshold') ? 'error' : '' }
            />

            <button>Add New Project Listing</button>
            { error && <div className="error">{ error }</div> }
            </form>
        </div>
    )
}

export default CreateProject