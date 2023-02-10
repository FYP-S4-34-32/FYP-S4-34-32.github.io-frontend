//==================================================//
// Check whether context is used in the right scope //
//==================================================//

import { AuthenticationContext } from '../context/AuthenticationContext'
import { useContext } from 'react'

export const useAuthenticationContext = () => {
    const context = useContext(AuthenticationContext) // returns the value of AuthenticationContext -> value in the context provider = {...state, dispatch}

    // if the context is used outside the application components tree it will throw an error
    if (!context) {
        throw Error('useAuthenticationContext must be used inside a AuthenticationContextProvider')
    }

    // returns the value of AuthenticationContext -> value in the context provider = {...state, dispatch}
    return context
}