// ================================ //
// Handles the fetching of profile //
// ================================ //

import { useState } from 'react'
import { useAuthenticationContext } from '../hooks/useAuthenticationContext' 

export const useFetchProfile = () => {
    const { user } = useAuthenticationContext()   
    const [fetchProfileError, setError] = useState(null)
    const [fetchProfileIsLoading, setIsLoading] = useState(null)
    const [profile, setProfile] = useState(user)

    const fetchProfile = async (email) => { 

        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/user/profile', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
        })

        const json = await response.json()  

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok) {
            setIsLoading(false)
            setProfile(json) 
        } 
    }

    return { fetchProfile, fetchProfileIsLoading, fetchProfileError, profile}
}