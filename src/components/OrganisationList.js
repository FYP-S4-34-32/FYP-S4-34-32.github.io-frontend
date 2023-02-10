//==============================//
// Organisation Listing display //
//==============================//

// imports
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useAuthenticationContext } from "../hooks/useAuthenticationContext"
import { Link } from "react-router-dom"


const OrganisationList = ({ organisation }) => {
    const { user } = useAuthenticationContext()

    // if there is no user object - not logged in
    if (!user) {
        return
    }

    return (
        <div className="project-list" key={ organisation._id }>
            <Link to={ `/organisations/${ organisation._id }` }>
                <h4>{ organisation.orgname }</h4>
                {/* <p><strong>Organisation Title: </strong>{ organisation.title }</p> */}
                {/* <p><strong>Organisation Description: </strong>{ organisation.description }</p> */}
                {/*<p><strong>Skills needed: </strong>{ project.skills.map(s => s.skill).join(', ') }</p> */}
                {/* user.role === 'Admin' && <p><strong>Threshold: </strong>{ project.threshold }</p> } { only display threshold for Admins */}
                <p><strong>Organisation Code: </strong>{ organisation.organisation_id }</p>
                <p>Created { formatDistanceToNow(new Date(organisation.createdAt), { addSuffix: true }) } by { organisation.created_by }</p>
            </Link>
        </div>
    )
}

export default OrganisationList