//================================//
// Context Provider to set states //
//================================//

// imports
import { createContext, useReducer } from "react";

// creates a context
export const AssignmentContext = createContext()

// invoked by the dispatch function
export const assignmentReducer = (state, action) => {

    switch(action.type) {
        case 'SET_ASSIGNMENTS': // set all assignments
            return {
                assignments: action.payload // payload in this case is an array of assignment objects
            }
        case 'SET_ONE_ASSIGNMENT': // set one assignment object
            return {
                assignment: action.payload // payload in this case is an assignment object
            }
        case 'CREATE_ASSIGNMENT': 
            return {
                assignments: [action.payload, ...state.assignments]
            }
        case 'DELETE_ASSIGNMENT':
            return {
                assignments: state.assignments.filter((a) =>
                    a._id !== action.payload._id // filter out the assignment object to be deleted to update the global state
                )
            }
        default:
                return state // state unchanged
    }
}

// provide context to application component tree for components to access
export const AssignmentContextProvider = ({ children }) => { // whatever the context provider is wrapping
    // reducer hook
    const [state, dispatch] = useReducer(assignmentReducer, {
        assignments: null
    })

    // this is the part that will wrap whatever parts of our application that need access to this context
    // ...state will provide the properties of the object - assignment objects in this case
    return (
        <AssignmentContext.Provider value={{ ...state, dispatch }}> {/* ...state here will be referring the assignment above this line */}
            { children }
        </AssignmentContext.Provider>
    )
}