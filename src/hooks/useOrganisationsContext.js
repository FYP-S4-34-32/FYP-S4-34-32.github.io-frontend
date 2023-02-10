/* to check whether the context is used in the right scope */

// imports
import { OrganisationsContext } from "../context/OrganisationContext";
import { useContext } from "react";



export const useOrganisationsContext = () => {
    const context = useContext(OrganisationsContext) // returns the value of OrganisationsContext -> value in the context provider = {...state, dispatch}

    // if the context is used outside the application components tree it will throw an error
    if (!context) {
        throw Error("useOrganisationsContext must be used inside an OrganisationsContextProvider")
    }

    // returns the value of OrganisationsContext -> value in the context provider = {...state, dispatch}
    return context
}