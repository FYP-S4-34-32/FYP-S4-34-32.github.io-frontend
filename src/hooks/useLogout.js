import { useAuthenticationContext } from "./useAuthenticationContext"


export const useLogout = () => {
    const { dispatch } = useAuthenticationContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({type: 'LOGOUT'}) // no payload - just reset the user = null in useAuthenticationContext.js
        
        // clear global state - prevent the previous state from flashing
        // insert code here
    }

    return { logout }
}