//================================//
// Context Provider to set states //
//================================//

// imports
import { createContext, useReducer } from "react";

// creates a context
export const OrganisationsContext = createContext()

// invoked by the dispatch function
export const organisationsReducer = (state, action) => {

    switch(action.type) {
        case 'SET_ORGANISATIONS': // set all organisation
            return {
                organisations: action.payload // payload in this case is an array of organisation objects
            }
        case 'SET_ONE_ORGANISATION': // set one organisation
            return {
                organisation: action.payload // payload in this is a organisation object
            }
        case 'CREATE_ORGANISATION': 
            return {
                organisations: [action.payload, ...state.organisations] // payload in this case is a SINGLE new organisation object / ...state.organisations spreads out the current state of the organisation
                                                                // action.payload is at the front, so newly created organisations will appear at the top instead of the bottom
            }
        case 'DELETE_ORGANISATION':
            return {
                organisations: state.organisations.filter((o) =>
                    o._id !== action.payload._id // filter out the organisation object to be deleted to update the global state
                )
            }
        default:
                return state // state unchanged
    }
}

// provide context to application component tree for components to access
export const OrganisationsContextProvider = ({ children }) => { // whatever the context provider is wrapping
    // reducer hook
    const [state, dispatch] = useReducer(organisationsReducer, {
        organisations: null
    })

    // this is the part that will wrap whatever parts of our application that need access to this context
    // ...state will provide the properties of the object - organisation objects in this case
    return (
        <OrganisationsContext.Provider value={{ ...state, dispatch }}> {/* ...state here will be referring the organisations above this line */}
            { children }
        </OrganisationsContext.Provider>
    )
}