//============================//
// Organisations Listing Page //
//============================//

// imports 
import { useEffect } from "react"
import { useAuthenticationContext } from '../hooks/useAuthenticationContext' 
import OrganisationList from "../components/OrganisationList"
import { useOrganisationsContext } from "../hooks/useOrganisationsContext"

const Organisations = () => {
    // hooks
    const { user } = useAuthenticationContext()
    const { organisations, dispatch } = useOrganisationsContext()

    // fires when component is rendered
    useEffect(() => {
        const fetchOrganisations = async () => {
            const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/organisation', {
                headers: {
                    'Authorization': `Bearer ${ user.token }` // sends authorisation header with the uer's token -> backend will validate token -> if valid, grant access to API
                }
            }) // using fetch() api to fetch data ad store in the variable
            const json = await response.json() // response object into json object, in this case an array of organisation objects

            // response OK
            if (response.ok) {
                dispatch({ type: 'SET_ORGANISATIONS', payload: json})
            }
        }

        // if there is an authenticated user
        if (user && user.role === "Super Admin") {
            fetchOrganisations()
        }
    }, [dispatch, user])

    // return a template
    return ( 
        <div> 
            <div className="projects">
                <h2>Organisation Listings</h2>
                { organisations && organisations.map((organisation) => ( // will only run when there is a organisation object
                    <OrganisationList key={ organisation._id } organisation={ organisation } /> // key must be unique
                ))}
            </div>  
        </div>
    )
}

export default Organisations