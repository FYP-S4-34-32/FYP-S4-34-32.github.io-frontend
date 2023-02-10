//======================//
// Project Listing Page //
//======================//

// imports 
import { useEffect } from "react"
import { useAuthenticationContext } from '../hooks/useAuthenticationContext' 
import ProjectList from "../components/ProjectList"
import { useProjectsContext } from "../hooks/useProjectsContext"

const Projects = () => {
    // hooks
    const { user } = useAuthenticationContext()
    const { projects, dispatch } = useProjectsContext()

    // fires when component is rendered
    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('/api/project', {
                headers: {
                    'Authorization': `Bearer ${ user.token }` // sends authorisation header with the uer's token -> backend will validate token -> if valid, grant access to API
                }
            }) // using fetch() api to fetch data ad store in the variable
            const json = await response.json() // response object into json object, in this case an array of project objects

            // response OK
            if (response.ok) {
                dispatch({ type: 'SET_PROJECTS', payload: json})
            }
        }

        // if there is an authenticated user
        if (user) {
            fetchProjects()
        }
    }, [dispatch, user])

    // return a template
    return ( 
        <div> 
            <div className="projects">
                <h2>Project Listings</h2>
                { projects && projects.map((project) => { // will only run when there is a project object
                // if user is an Admin - admins can view all the projects that they or other admins in the organisation have created
                if (user.role === "Admin") {
                    if (user.organisation_id === project.organisation_id) { // check if project belongs to user under same organisation
                        return(<ProjectList key={ project._id } project={ project } />) // key must be unique
                    }
                }
                // if user is an Employee - employee can only view projects that are in the same Assignment object as them
                if (user.role === "Employee") {
                    if ((user.current_assignment === project.assignment) // compare assignment between user and projects
                        && (user.organisation_id === project.organisation_id) // compare organisation between user and projects
                        && (project.active === true)) { // check if project is active
                            return (<ProjectList key={ project._id } project={ project } />)
                        }
                }
            })}
            </div>  
        </div>
    )
}

export default Projects