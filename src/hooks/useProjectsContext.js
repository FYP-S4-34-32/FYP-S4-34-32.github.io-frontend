


/* to check whether the context is used in the right scope */

// imports
import { ProjectsContext } from "../context/ProjectContext";
import { useContext } from "react";



export const useProjectsContext = () => {
    const context = useContext(ProjectsContext) // returns the value of ProjectsContext -> value in the context provider = {...state, dispatch}

    // if the context is used outside the application components tree it will throw an error
    if (!context) {
        throw Error("useProjectsContext must be used inside an ProjectsContextProvider")
    }

    // returns the value of ProjectsContext -> value in the context provider = {...state, dispatch}
    return context
}