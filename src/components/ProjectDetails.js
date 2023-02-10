//================================================//
// Project Details page for an individual project //
//================================================//

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthenticationContext } from "../hooks/useAuthenticationContext";
import { useProjectsContext } from "../hooks/useProjectsContext";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const ProjectDetails = () => {
    const { user } = useAuthenticationContext()
    const { project, dispatch } = useProjectsContext() // note project instead of projects -> because we are setting the state of ONE project using SET_ONE_PROJECT

    const { id } = useParams()

    const navigate = useNavigate()

    const [assigned, setAssigned] = useState(false)
    
    // fires when the component is rendered
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
            }

            // if (user.role === "Employee") {
            //     const { project_assigned } = user // get the projects the user is assigned
                
            //     if (project_assigned.length > 0) {
            //         for (var i = 0; i < project_assigned.length; i++) {
            //             if (project_assigned[i].assignment_id === json.assignment) {
            //                 if (project_assigned[i].projects.includes(json.title)) {
            //                     setAssigned(true)
            //                 }
            //             }
            //         }
            //     }
            // }
        }

        // if there is an authenticated user
        if (user) {
            fetchProject()
        }
    }, [dispatch, user, id])

    // delete project
    const handleClick = async () => {
        const response = await fetch('/api/project/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${ user.token }`
            }
        })

        const json = await response.json() // document of the project object that was deleted

        // response OK
        if (response.ok) {
            navigate('/') // navigate back to home page aka project listing page
        }

        // reponse NOT ok
        if (!response.ok) {
            console.log(json.error) // the error property from projectController.deleteProject --> return res.status(404).json({ error: "No such project" })
        }
    }

    // close project
    const handleCloseProject = async () => {
        const response = await fetch('/api/assignment/closeProject/' + id, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${ user.token }`
            }
        })
    }

    return (
        <div className="project-details">
            { project && (
                <article>
                    <h2>{ project.title }</h2>
                    { user.role === "Admin" && <Link to={`/projects/editproject/` + id } className="material-symbols-outlined">edit</Link>}
                    {/* { user.role === "Admin" && <p onClick={ handleClick } className="material-symbols-outlined">Delete</p>} */}
                    <p>Created { formatDistanceToNow(new Date(project.createdAt), { addSuffix: true }) } by { project.created_by }</p>
                    <div>
                        <p><strong>Project Description: </strong></p>
                        <p>{ project.description }</p>
                    </div>
                    <div>
                        <p><strong>Project Requirements: </strong></p>
                        <p>{ project.requirements }</p>

                    </div>
                    <div>
                        <p><strong>Skills needed: </strong></p>
                        { project.skills.map(s => (
                            <p key={ s.skill }>{ s.skill } - { s.competency }</p>
                        )) }
                    </div>
                    { project.assigned_to.employees.length > 0 && (
                        <div>
                            <p><strong>Assigned to:</strong></p>
                            { project.assigned_to.employees.map(e => (
                                <p key={e}>{e}</p>
                            )) }
                        </div>
                    )}
                    { user.role === 'Admin' && <div><p><strong>Number of People Needed: </strong>{ project.threshold }</p></div> }
                    { user.role === 'Admin' && <button onClick={ handleClick }>Delete</button> }
                    { user.role === 'Admin' && <button onClick={ handleCloseProject }>Close Project</button>}
                </article>
            )}
        </div>
    );
}
 
export default ProjectDetails;