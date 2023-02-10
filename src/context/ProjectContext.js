//================================//
// Context Provider to set states //
//================================//

// imports
import { createContext, useReducer } from "react";

// creates a context
export const ProjectsContext = createContext()

// invoked by the dispatch function
export const projectsReducer = (state, action) => {

    switch(action.type) {
        case 'SET_PROJECTS': // set all project
            return {
                projects: action.payload // payload in this case is an array of project objects
            }
        case 'SET_ONE_PROJECT': // set one project
            return {
                project: action.payload // payload in this is a project object
            }
        case 'CREATE_PROJECT': 
            return {
                projects: [action.payload, ...state.projects] // payload in this case is a SINGLE new project object / ...state.projects spreads out the current state of the project
                                                                // action.payload is at the front, so newly created project will appear at the top instead of the bottom
            }
        case 'DELETE_PROJECT':
            return {
                projects: state.projects.filter((p) =>
                    p._id !== action.payload._id // filter out the project object to be deleted to update the global state
                )
            }
        default:
                return state // state unchanged
    }
}

// provide context to application component tree for components to access
export const ProjectsContextProvider = ({ children }) => { // whatever the context provider is wrapping
    // reducer hook
    const [state, dispatch] = useReducer(projectsReducer, {
        projects: null
    })

    // this is the part that will wrap whatever parts of our application that need access to this context
    // ...state will provide the properties of the object - project objects in this case
    return (
        <ProjectsContext.Provider value={{ ...state, dispatch }}> {/* ...state here will be referring the projects above this line */}
            { children }
        </ProjectsContext.Provider>
    )
}