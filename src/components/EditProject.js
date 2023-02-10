//===============//
// Edit Project //
//==============//

// imports
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthenticationContext } from "../hooks/useAuthenticationContext"
import { useProjectsContext } from '../hooks/useProjectsContext'
import { useGetOrganisationSkills } from '../hooks/useGetOrgSkills'

const EditProject = () => {
    const { user } = useAuthenticationContext()
    const { project, dispatch } = useProjectsContext()

    const { id } = useParams()

    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [requirements, setRequirements] = useState(null)
    const [originalSkills, setOriginalSkills] = useState([])
    const [originalCompetency, setOriginalCompetency] = useState([])
    const [threshold, setThreshold] = useState(null)
    const [error, setError] = useState(null) // default value = no error

    // handle adding skills to project
    const { getOrganisationSkills, allSkills } = useGetOrganisationSkills(); // fetch all skills defined for the organisation
    const [skills, setSkills] = useState([]) // all available skills
    const competency = ["Beginner", "Intermediate", "Advanced"] // the three levels of skill competency
    const [selectFields, setSelectFields] = useState([])
    const [projectSkills, setProjectSkills] = useState([]) // array to store skills selected
    const [projectCompetency, setProjectCompetency] = useState([]) // array to store competency level selected

    // state for empty fields validation
    const [emptyFields, setEmptyFields] = useState([]) // empty array by default

    const navigate = useNavigate()

    // fetch project details
    useEffect(() => {
        const fetchProject = async () => {
            const response = await fetch('/api/project/' + id, { // fetch the project based on the project's id
                headers: {
                    'Authorization': `Bearer ${ user.token }` // sends authorisation header with the user's token -> backend will validate token -> if valid, grant access to API
                }
            }) // using fetch() api to fetch data and store in the variable

            const json = await response.json() // response object into json object

            // response OK
            if (response.ok) {
                dispatch({ type: 'SET_ONE_PROJECT', payload: json})
                setTitle(project.title)
                setDescription(project.description)
                setRequirements(project.requirements)
                setThreshold(project.threshold)

                const dummySkill = []
                const dummyCompetency = []


                for (var i = 0; i < project.skills.length; i++) {
                    dummySkill.push(project.skills[i].skill)
                    dummyCompetency.push(project.skills[i].competency)
                }

                setOriginalSkills(dummySkill)
                setOriginalCompetency(dummyCompetency)
            }
        }

        // const fetchSkills = async () => {
        //     const response = await fetch('/api/skill/', {
        //         headers: {
        //             'Authorization': `Bearer ${ user.token }` // sends authorisation header with the uer's token -> backend will validate token -> if valid, grant access to API
        //         }
        //     }) // using fetch() api to fetch data and store in the variable
        //     const json = await response.json() // response object into json object, in this case an array of skills objects
        //     console.log(json)

        //     // response OK
        //     if (response.ok) {
        //         setSkills(json)
        //     }
        // }
        getOrganisationSkills(user.organisation_id)

        // if there is an authenticated user
        if (user && user.role === "Admin") {
            fetchProject()
        } else {
            navigate('/')
        }
    }, [])

    // update the original skills array
    const updateOriginalSkillArray = (index, value) => {
        console.log("before updating: ", originalSkills)

        originalSkills[index] = value

        console.log("after updating: ", originalSkills)
    }

    // update the original competency array
    const updateOriginalCompetencyArray = (index, value) => {
        originalCompetency[index] = value
    }

    // delete original
    const handleRemoveOriginal = (id) => {
        // remove from original skills array
        originalSkills.splice(project.skills.findIndex(x => x._id === id), 1)

        // remove from original competency array
        originalCompetency.splice(project.skills.findIndex(x => x._id === id), 1)

        const removeDiv = (id) => {
            var div = document.getElementById(id)
            var parent = div.parentNode
            parent.removeChild(div)
        }

        removeDiv(id)
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


    // handle edit project details
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError("You must be logged in")
            return
        }

        const project = { 
            title, 
            description,
            requirements, 
            projectSkills: originalSkills.concat(projectSkills), 
            projectCompetency: originalCompetency.concat(projectCompetency), 
            threshold }

        // update data
        const response = await fetch('/api/project/editproject/' + id, {
            method: 'PATCH',
            body: JSON.stringify(project),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ user.token }`
            }
        }) // send patch request
        const json = await response.json()

        // response NOT ok
        if (!response.ok) {
            setError(json.error) // error property

            setEmptyFields(json.emptyFields)
        }

        if (response.ok) {
            setError(null)
            
            // reset the form
            setTitle('') // reset title
            setDescription('') // reset description
            setRequirements('') // reset requirements
            setOriginalSkills([])
            setOriginalCompetency([])
            setThreshold(null) // reset threshold

            setProjectSkills([])
            setProjectCompetency([])
            setSelectFields([])

            setSkills([])

            setEmptyFields([]) // reset the emptyfields array
            
            console.log('Project Updated')

            navigate('/projects/' + id) // navigate back to home page aka project listing page
        }
    }

    return (
        <div className='create'>
            <h2>Edit Project Listing</h2>
            { project && (
                <form onSubmit={ handleSubmit }>
                    <label>Project Title:</label>
                    <input 
                        type="text"
                        onChange={ e => setTitle(e.target.value) }
                        defaultValue={ title }
                        className={ emptyFields?.includes('title') ? 'error': ''}
                    />

                    <label>Project Description:</label>
                    <textarea
                        type="text"
                        onChange={(e) => setDescription(e.target.value)} 
                        defaultValue={ description }
                        className={ emptyFields?.includes('description') ? 'error': ''}
                    />

                    <label>Project Requirements:</label>
                    <textarea
                        type="text"
                        onChange={(e) => setRequirements(e.target.value)} 
                        defaultValue={ requirements }
                        className={ emptyFields?.includes('requirements') ? 'error': ''}
                    />

                    <label>Skills Required:</label>
                    { project.skills && project.skills.map((s) => (
                        <div key={s._id} id={s._id}>
                            <select
                                defaultValue={s.skill}
                                onChange={(e) => updateOriginalSkillArray(project.skills.findIndex(x => x._id === s._id), e.target.value)}
                                className={ (emptyFields?.includes('noSkill') || emptyFields?.includes('skillError')) ? 'error' : '' }
                            >
                                <option value={s.skill}>{s.skill}</option>
                                { allSkills?.map(s => (
                                    <option key={s.skillName} value={s.skillName}>{s.skillName}</option>
                                ))}
                            </select>
                            <select
                                defaultValue={s.competency}
                                onChange={(e) => updateOriginalCompetencyArray(project.skills.findIndex(x => x._id === s._id), e.target.value)}
                                className={ (emptyFields?.includes('noSkill') || emptyFields?.includes('skillError')) ? 'error' : '' }
                            >
                                <option value={s.competency}>{s.competency}</option>
                                { competency.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined" onClick={() => handleRemoveOriginal(s._id)}>delete</span>
                        </div>
                    ))}
                    { selectFields.map((field) => (
                        <div key={ field.id }>
                            <select
                                value={ projectSkills[projectSkills.length] }
                                onChange={(e) => addProjectSkills(selectFields.findIndex(x => x.id === field.id), e.target.value)}
                                className={ (emptyFields?.includes('noSkill') || emptyFields?.includes('skillError')) ? 'error' : '' }
                            >
                                <option value="dummy">Please select a skill</option>
                                { allSkills?.map(s => (
                                    <option key={ s.skillName } value={ s.skillName }>{ s.skillName }</option>
                                ))}
                            </select>
                            <select
                                value={ projectCompetency[projectCompetency.length] }
                                onChange={(e) => addProjectCompetency(selectFields.findIndex(x => x.id === field.id), e.target.value)}
                                className={ (emptyFields?.includes('noSkill') || emptyFields?.includes('skillError')) ? 'error' : '' }
                            >
                                <option value="dummy">Please select a competency level</option>
                                { competency.map(c => (
                                    <option key={ c } value={ c }>{ c }</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined" onClick = {() => handleRemoveField(field.id) }>delete</span>
                        </div>
                    ))}
                    <button className={ emptyFields?.includes('noSkill') ? 'error' : '' } type="button" onClick={ handleAddField }>Add Skills</button>
                    <br></br><br></br>

                    <label>Number of People Needed:</label>
                    <input 
                        type="number"
                        onChange={ (e) => setThreshold(e.target.value) }
                        defaultValue={ threshold }
                        className={ emptyFields?.includes('threshold') ? 'error' : '' }
                    />

                    <button>Edit Project Listing</button>
                    { error && <div className="error">{ error }</div> }
                </form>
            )}
        </div>
    )
}

export default EditProject