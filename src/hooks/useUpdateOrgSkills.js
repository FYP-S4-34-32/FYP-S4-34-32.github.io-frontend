
import { useState } from 'react';
import { useAuthenticationContext } from '../hooks/useAuthenticationContext'

export const useUpdateOrgSkill = () => {
    const { user } = useAuthenticationContext()
    const [updateOrgSkillsError, setError] = useState(null);
    const [uodateOrgSkillsLoading, setIsLoading] = useState(null);

    const updateOrgSkill = async (organisation_id, organisation_skills) => {
        setIsLoading(true);
        setError(null);

        console.log("new skill to be added: ", organisation_skills);

        const response = await fetch('/api/Organisation/updateOrganisationSkils', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                      'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({organisation_id, organisation_skills})
        })

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }

        if(response.ok) {
            setIsLoading(false);
        } 

        console.log("response: ", json);
    }

    return { updateOrgSkill, updateOrgSkillsError, uodateOrgSkillsLoading};
}