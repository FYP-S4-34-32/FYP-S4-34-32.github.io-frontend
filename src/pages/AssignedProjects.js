// ============================ //
// Employee's current projects
// ============================ //

import { useEffect, useState } from 'react'
import { useAuthenticationContext } from '../hooks/useAuthenticationContext' 

const AssignedProjects = () => {
    var assignedProjectsArray = []

    const { user } = useAuthenticationContext() // get the user object from the context

    const getAssignedProjects = () => { 
        for (var i = 0; i < user.project_assigned.length; i++) {
            
            for (var j = 0; j < user.project_assigned[i].projects.length; j++) {
                assignedProjectsArray.push(user.project_assigned[i].projects[j])
            }
        }
    }

    getAssignedProjects() 
    console.log("assignedProjectsArray: ", assignedProjectsArray) 

    // display the assigned projects
    const showAssignedProjects = assignedProjectsArray.map((project) => {
        return (
            <div className="project-div" key={project}> 
                <h3>{project}</h3>   
            </div>
        )
    })

    

    return (
        <div className="assigned-projects">
            <h2>Assigned Projects</h2> 
            {showAssignedProjects}
        </div>
    )
}

export default AssignedProjects

