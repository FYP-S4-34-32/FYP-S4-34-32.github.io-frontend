import { useState } from "react";
import { useAuthenticationContext } from '../hooks/useAuthenticationContext' 
import { useOrganisationsContext } from "../hooks/useOrganisationsContext";

export const useGetOrganisationSkills = () => {
    const { user } = useAuthenticationContext()
    const [getOrganisationSkillsError, setError] = useState(null);
    const [getOrganisationSkillsIsLoading, setIsLoading] = useState(null);
    const [allSkills, setAllSkills] = useState([]);

    const getOrganisationSkills = async (organisation_id) => {
        setIsLoading(true);
        setError(null);
        console.log("user organisation id: ", organisation_id);

        const response = await fetch('/api/organisation/getOrganisationSkills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                       'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({organisation_id})
        })

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }

        if(response.ok) {
            setIsLoading(false);
            setAllSkills(json);
        }
    }

    return { getOrganisationSkills, getOrganisationSkillsIsLoading, getOrganisationSkillsError, allSkills};
}