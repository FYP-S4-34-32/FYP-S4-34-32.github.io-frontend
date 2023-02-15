//=========================================//
// User Details page for an employee/user //
//=======================================//

// Path: Code/frontend/src/components/UserDetails.js

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthenticationContext } from '../hooks/useAuthenticationContext' 
import { useLocation, Link } from "react-router-dom";
import { useFetchProfile } from '../hooks/useFetchProfile';
import { useUpdateInfo } from '../hooks/useUpdateInfo'  // contact info 
import { useUpdateRole } from '../hooks/useUpdateRole' 

const UserDetails = () => {
    const { user } = useAuthenticationContext(); // current user (admin or superadmin)
    const {updateInfo, isLoading, error, updateContact, resetError, resetUpdateContact} = useUpdateInfo();  
    const {updateRole, updateRoleIsLoading, updateRoleError, updateRoleSuccess} = useUpdateRole();
    const navigate = useNavigate();
    const location = useLocation(); 
    const { fetchProfile, fetchProfileIsLoading, fetchProfileError, profile } = useFetchProfile()  // updated profile

    const userDetails = location.state // user details passed from UserList.js (not updated)
    const pathname = location.pathname
    const [editContactForm, setEditContactForm] = useState(false) 
    const [editRoleForm, setEditRoleForm] = useState(false) 
    var assignedProjectsArray = [];

    useEffect(() => {
        // get profile of the user
        if (user.role === 'Super Admin' || user.role === 'Admin') {
            fetchProfile(userDetails.email); 
        }
    }, [])   
    
    const [userContact, setUserContact] = useState(profile.contact) 
    const [userRole, setUserRole] = useState(profile.role) 

    const displaySkills = userDetails.skills.map((skill) => {
        return (
            <div key={skill._id}>
                <p> {skill.skill} : {skill.competency} </p>

            </div>
        )
    }) 

    const getAssignedProjects = () => { 
        
        for (var i = 0; i < userDetails.project_assigned.length; i++) {
            
            for (var j = 0; j < userDetails.project_assigned[i].projects.length; j++) {
                assignedProjectsArray.push(userDetails.project_assigned[i].projects[j])
            }
        }
    }
    getAssignedProjects();
    

    const displayProjects = assignedProjectsArray.map((project) => {
        return (
            <div key={project}>
                <p> {project} </p>
            </div>
        )
    })  

    const handleSubmitContactInfo = async(e) => {
        e.preventDefault(); 

        setEditContactForm(!editContactForm)
        await updateInfo(userDetails.email, userContact)  
        fetchProfile(userDetails.email);

        setUserContact(profile.contact);  
    } 
     
    const handleSubmitUserRole = async(e) => {
        e.preventDefault(); 

        setUserRole(await updateRole(userDetails.email, userRole));
        setEditRoleForm(!editRoleForm);
    } 

    const displayUserDetails = () => {  
        // superadmin does not have skills/projects 
        if (profile.role === 'Super Admin') {
            return (
                <div className="user-Details-detailsDiv" style={{width:"100%"}}>  
                    <h4>Name</h4>
                    {profile && <p> {profile.name} </p>}  

                    <hr/>

                    <h4>Name</h4>
                    {profile && <p> {profile.email} </p>}
                    <hr/>

                    <h4>Role</h4>
                    {profile && <p> {profile.role} </p>} 
                    <hr/>

                    <h4>Contact Info</h4> 
                    {profile && <p> {profile.contact} </p>}  
                </div>
            )
        }

        // project admins do not have skills/projects, but have organisation
        else if (profile.role === 'Admin') {
            return (
                <div>
                    <div className="user-Details-detailsDiv" style={{width:"60%", marginTop:"0px"}}>
                        <h4>Name</h4>
                        {profile && <p> {profile.name} </p>}   
                        <hr/>

                        <h4>Name</h4>
                        {profile && <p> {profile.email} </p>}
                        <hr/>

                        <h4 >Role</h4>
                        <form onSubmit={handleSubmitUserRole}>
                            <select defaultValue={profile.role} disabled={!editRoleForm} onChange={(e) => setUserRole(e.target.value)}>
                                <option value="Admin">Admin</option>
                                <option value="Employee">Employee</option> 
                            </select>
                            <button className="editRoleBtn" type="button" onClick={() => setEditRoleForm(!editRoleForm)} disabled={ isLoading }>Edit</button>
                            {editRoleForm && <button className="submitBtn">Submit</button>}
                            {updateRoleError && <div className="error">{updateRoleError}</div>}
                            {updateRoleSuccess && <div className="success">Role updated successfully</div>}
                        </form>
                        
                        <hr/>

                        <h4>Contact Info</h4>
                        { profile && <p style={{display:'inline'}}> { profile.contact } </p> }

                        <button className="editContactBtn" type="button" onClick={() => {setEditContactForm(!editContactForm); setUserContact(profile.contact)}} disabled={ isLoading }>Edit</button>
                        <br></br><br></br>
                        { editContactForm &&
                            <form onSubmit={handleSubmitContactInfo}>
                                <input style={{width: "780px"}}
                                    type="contact"
                                    name="contact"
                                    value={userContact} 
                                    onChange={(e) => setUserContact(e.target.value)}
                                />
                                
                                <button className="submitBtn" style={{position:"absolute", right:"60px"}}>Save</button> 
                                <button className="cancelBtn" style={{position:"absolute", right:"160px"}}>Cancel</button>
                            </form>      
                        }
                        <br></br><br></br>
                        {error && <div className="error" style={{width:"80%", marginLeft:"60px"}}>{error}</div>}
                    </div>
                     <div className='userDetails-orgDiv' style={{width:"40%"}}>
                        <h4>Organisation</h4>
                        {profile && <p> {profile.organisation_id} </p>}
                    </div> 
                </div>
            ) 
        }

        // employees have skills, projects and organisation
        else if (profile.role === 'Employee') {
            return (
                <div>  
                     <div className="user-Details-detailsDiv"> 
                        <h4>Name</h4>
                        {profile && <p> {profile.name} </p>}   
                        <hr/>
        
                        <h4>Name</h4>
                        {profile && <p> {profile.email} </p>}
                        <hr/>
        
                        <h4>Role</h4>
                        {/* ONLY SUPER ADMIN CAN EDIT USER ROLES*/}
                        {user.role === 'Super Admin' && 
                            <form onSubmit={handleSubmitUserRole}>
                                <select defaultValue={profile.role} disabled={!editRoleForm} onChange={(e) => setUserRole(e.target.value)}>
                                    <option value="Admin">Admin</option>
                                    <option value="Employee">Employee</option> 
                                </select>
                                <button className="editRoleBtn" type="button" onClick={() => {setEditRoleForm(!editRoleForm); setUserRole(profile.role)}} disabled={ isLoading }>Edit</button>
                                {editRoleForm && <button className="submitBtn">Submit</button>}
                                {updateRoleError && <div className="error">{updateRoleError}</div>}
                                {updateRoleSuccess && <div className="success">Role updated successfully</div>}
                            </form>
                        }   

                        {user.role !== 'Super Admin' && <p> {profile.role} </p>} {/*PROJECT ADMINS CAN ONLY VIEW USER ROLES*/}
                        <hr/>
        
                        <h4>Contact Info</h4>
                        { profile && <p style={{display:'inline'}}> { profile.contact } </p> }

                        <button className="editContactBtn" type="button" onClick={() => {setEditContactForm(!editContactForm); setUserContact(profile.contact)}} disabled={ isLoading }>Edit</button>
                        { editContactForm &&
                            <form onSubmit={handleSubmitContactInfo}>
                                <input 
                                    type="contact"
                                    name="contact"
                                    value={userContact} 
                                    onChange={(e) => setUserContact(e.target.value)}
                                />

                                <button className="submitBtn">Save</button>
                                {error && <div className="error">{error}</div>} 
                            </form>      
                        }
                          
                    </div>
                    <div style={{width:"50%"}}>
                        <div className="userDetails-tableDiv">
                            <div className='userDetails-orgDiv'>
                                <h4>Organisation</h4>
                                {profile && <p> {profile.organisation_id} </p>}
                            </div>
                
                            <div className="userDetails-skillsDiv">
                                <h4>Skills</h4>
                                {profile && displaySkills}
                            </div>
                        </div> 

                        <div className='userDetails-projectsDiv'>
                            <h4>Projects</h4>
                            {displayProjects}
                        </div> 
                    </div> 
                </div>
            )
        }
    }

    return (
        <div className="user-Details">
            <Link to="/AllUsers"> Back to Users</Link>
            <br/>
            <h2>User Details</h2>  
            
            {displayUserDetails()}     
        </div>
    )
}

export default UserDetails;