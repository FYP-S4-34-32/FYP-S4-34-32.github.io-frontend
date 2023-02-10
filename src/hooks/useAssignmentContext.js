


/* to check whether the context is used in the right scope */

// imports
import { AssignmentContext } from "../context/AssignmentContext";
import { useContext } from "react";



export const useAssignmentContext = () => {
    const context = useContext(AssignmentContext) // returns the value of AssignmentContext -> value in the context provider = {...state, dispatch}

    // if the context is used outside the application components tree it will throw an error
    if (!context) {
        throw Error("useAssignmentContext must be used inside an AssignmentContextProvider")
    }

    // returns the value of AssignmentContext -> value in the context provider = {...state, dispatch}
    return context
}