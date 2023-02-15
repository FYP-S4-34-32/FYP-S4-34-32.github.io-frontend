//=====================================================//
// Organisation Details page for an individual project //
//=====================================================//

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthenticationContext } from "../hooks/useAuthenticationContext";
import { useOrganisationsContext } from "../hooks/useOrganisationsContext";
import { useGetAllUsers } from '../hooks/useGetAllUsers'
import { useDeleteUser } from '../hooks/useDeleteUser'
import { useDeleteUsers } from '../hooks/useDeleteUsers'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const OrganisationDetails = () => {
    var allUsersArray = []
    var projectAdminsArray = []
    var allEmployeesArray = [] 
    var organisationEmployeesArray = []
    var organisationUsersArray = []
    const [deleteUsersArray, setDeleteUsersArray] = useState([])

    const { user } = useAuthenticationContext()
    const { organisation, dispatch } = useOrganisationsContext() // note organisation instead of organisations -> because we are setting the state of ONE organisation using SET_ONE_ORGANISATION

    const { id } = useParams()
    const navigate = useNavigate()

    const { getAllUsers, getAllUsersIsLoading, getAllUsersError, allUsers } = useGetAllUsers() // get the getAllUsers function from the context
    const { deleteOneUser, deleteUserIsLoading, deleteUserError } = useDeleteUser() // get the deleteUser function from the context
    const { deleteUsers} = useDeleteUsers() 
    const [selectedUsers, setSelectedUsers] = useState("")
    const [searchUsers, setSearch] = useState("")  

    // fires when the component is rendered
    useEffect(() => {
        const fetchOrganisation = async () => {
            const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/organisation/' + id, { // fetch the project based on the project's id
                headers: {
                    'Authorization': `Bearer ${ user.token }` // sends authorisation header with the user's token -> backend will validate token -> if valid, grant access to API
                }
            }) // using fetch() api to fetch data and store in the variable

            const json = await response.json() // response object into json object

            // response OK
            if (response.ok) {
                dispatch({ type: 'SET_ONE_ORGANISATION', payload: json})
            }
        }

        // if there is an authenticated user
        if (user && user.role === "Super Admin") {
            fetchOrganisation()
        }
    }, [dispatch, user, id])

    useEffect(() => {
        getAllUsers();
    }, []) 

    //filter users to match with current organisation id
    const filterOrganisationUsers = () => {
        if (organisation !== undefined) {
            allUsersArray = allUsers

            if (user.role == "Super Admin") {
                for (var i = 0; i < allUsersArray.length; i++) {
                    if (allUsersArray[i].organisation_id === organisation.organisation_id) {
                        organisationUsersArray.push(allUsers[i])
                    }
                }
            }
        }
    }

    filterOrganisationUsers();
    
    //filter users need to filter match user's organisation id with current organisation's orgname and sort by role
    const filterUsers = () => { 
        if (organisation !== undefined) {
            allUsersArray = allUsers

            if (user.role == "Super Admin") {
                for (var i = 0; i < allUsersArray.length; i++) {
                    if (allUsersArray[i].role === "Admin" && allUsersArray[i].organisation_id === organisation.organisation_id) {
                        projectAdminsArray.push(allUsers[i])
                    } else if (allUsersArray[i].role === "Employee" && allUsersArray[i].organisation_id === organisation.organisation_id) {
                        allEmployeesArray.push(allUsers[i])
                    }
                }
            }
        }
        
    }

    filterUsers(); 

    // delete a user from the database
    const deleteUser = async (email) => { 
        console.log("to be deleted user's email: ", email)
        await deleteOneUser(email); 
        getAllUsers(); // get updated array of users
        filterUsers(); // get updated array of users
    } 

    // Add a user to the array of users to be deleted
    const addDeleteUser = (event) => {
        const {value, checked} = event.target; // value = email address, checked = true/false 

        if (checked) { 

            if (deleteUsersArray.length === 0) {
                setDeleteUsersArray([value])  
            }
            else {
                setDeleteUsersArray(pre => [...pre, value]) 
            }

        } else { 

            setDeleteUsersArray(pre => {
                return pre.filter((email) => {
                    return email !== value
                })
            })
        } 
    }  

     // DISPLAY "delete user" button
    const deleteUserButton = () => {
        if (user.role === "Super Admin" && selectedUsers === "manageUsers") {
            return (
                <div>
                    <button className="deleteUsersBtn" onClick={HandleDeleteUsers}>Delete Users</button>
                </div>
            )
        } 
    }


    // DELETE MULTIPLE USERS from the database
    const HandleDeleteUsers = async(e) => {
        e.preventDefault();

        if (deleteUsersArray.length === 0) {
            alert("No users selected")
        }
        else {
            // CONFIRMATION BOX 
            let answer = window.confirm("Delete selected users?");

            if (answer) { // if user clicks OK, answer === true
                await deleteUsers(deleteUsersArray); // returns updated array of users  

                // clear the array of users to be deleted
                setDeleteUsersArray([]); 

                // // AFTER DELETING USERS, FETCH UPDATED ARRAY OF USERS  
                getAllUsers(); // get updated array of users
                filterOrganisationUsers(allUsers); // filter the updated array of users 
            }  
        } 
        
    }
    
    // search for users
    const searchUser = () => {   

        // super admin
        if (user.role === "Super Admin") {
            if (selectedUsers === "allUsers" || selectedUsers === "manageUsers" || selectedUsers === " " || selectedUsers === "" || selectedUsers === null || selectedUsers === undefined || !selectedUsers) { 
                if (searchUsers === "" || searchUsers === null || searchUsers === undefined || searchUsers === " " || !searchUsers) {
                    return organisationUsersArray;
                } 

                return organisationUsersArray.filter((user) => {  
                    return (user.name).toLowerCase().includes(searchUsers.toLowerCase()) || (user.email).toLowerCase().includes(searchUsers.toLowerCase()) || (user.role).toLowerCase().includes(searchUsers.toLowerCase());
                });
            }

            if (selectedUsers === "projectAdmins") {
                if (searchUsers === "" || searchUsers === null || searchUsers === undefined || searchUsers === " " || !searchUsers) {
                    return projectAdminsArray;
                }

                return projectAdminsArray.filter((user) => {
                    return (user.name).toLowerCase().includes(searchUsers.toLowerCase()) || (user.email).toLowerCase().includes(searchUsers.toLowerCase()) || (user.role).toLowerCase().includes(searchUsers.toLowerCase());
                })
            }

            if (selectedUsers === "employees") {
                if (searchUsers === "" || searchUsers === null || searchUsers === undefined || searchUsers === "" || !searchUsers) {
                    return allEmployeesArray;
                }
                
                return allEmployeesArray.filter((user) => {
                    return (user.name).toLowerCase().includes(searchUsers.toLowerCase()) || (user.email).toLowerCase().includes(searchUsers.toLowerCase()) || (user.role).toLowerCase().includes(searchUsers.toLowerCase());
                })
            }
        }

        // super admins
        if (user.role === "Super Admin") { 
            if (selectedUsers === "employees" || selectedUsers === "manageEmployees" ||  selectedUsers === "" || selectedUsers === "" || selectedUsers === null || selectedUsers === undefined || !selectedUsers) {
                if (searchUsers === "" || searchUsers === null || searchUsers === undefined || searchUsers === " " || !searchUsers) {
                    return organisationEmployeesArray;
                }

                return organisationEmployeesArray.filter((employee) => {
                    if (employee.organisation_id === user.organisation_id) {
                        return employee.name.toLowerCase().includes(searchUsers.toLowerCase());
                    }
                })
            } 
        }
    }

    const searchResults = searchUser(); 

    // pass user details to user details component
    const passUserDetails = (userDetails) => {
        console.log("user details: ", userDetails)
        const id = userDetails._id;
        const pathname = `/UserDetails/${id}`
        const state = userDetails

        navigate(pathname, {state}) // pass the user's email as state
    }

    const renderSearchResults = searchResults.map((datum) => {
        switch (selectedUsers) {
            case "manageUsers": 
                var userDetails = datum; 
                return (
                    <tbody key={userDetails._id}>
                        <tr>
                            <td>
                                <input className="checkBox" type="checkbox" value={userDetails.email} onChange={addDeleteUser}/>
                            </td>
                            <td className="user-cell"> 
                                <h3>{userDetails.name}</h3> 
                                <p>Organisation: {userDetails.organisation_id}</p>
                                <p>Email: {userDetails.email}</p>
                                <p>Role: {userDetails.role}</p>
                                <p>Contact Info: {userDetails.contact}</p>
                            </td>
                            <td>
                                <span className="material-symbols-outlined" id="deleteButton" onClick={() => deleteUser(userDetails.email)} style={{float:"right", marginRight:"30px", marginBottom:"30px"}}>delete</span>
                            </td>
                        </tr>
                    </tbody> 
                )  

            default:
                var userDetails = datum;
                return (
                    <tbody key={userDetails._id}>
                        <tr className="user-cell" style={{height:"210px"}} onClick={() => passUserDetails(userDetails)}>
                            <td>
                                <h3>{userDetails.name}</h3> 
                                <p>Organisation: {userDetails.organisation_id}</p>
                                <p>Email: {userDetails.email}</p>
                                <p>Role: {userDetails.role}</p>
                                <p>Contact Info: {userDetails.contact}</p>
                            </td>
                        </tr> 
                    </tbody>
                ) 
        } 
    });

    // panel that shows the types of users
    const showUsersPanel = (user) => {
        if (user.role === "Super Admin") { 
            return (
                <div className="selection-panel" style={{height:"200px"}}>
                    <button onClick={() => setSelectedUsers("allUsers")}>All Users</button>
                    <button onClick={() => setSelectedUsers("projectAdmins")}>Project Admins</button>
                    <button onClick={() =>setSelectedUsers("employees")}>Employees</button>
                    <button onClick={() =>setSelectedUsers("manageUsers")}>Manage Users</button>
                </div>
            )
        }
    }

    // delete organisation
    const handleClick = async () => {
        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/organisation/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${ user.token }`
            }
        })

        const json = await response.json() // document of the organisation object that was deleted

        // response OK
        if (response.ok) {
            navigate('/') // navigate back to home page aka organisation listing page
        }

        // reponse NOT ok
        if (!response.ok) {
            console.log(json.error) // the error property from organisationController.deleteOrganisation --> return res.status(404).json({ error: "No such organisation" })
        }
    }

    const handleSignUpUser = () => {
        // navigate to sign up user page, pass organisation.organisation_id as state (Signing up user for this current organisation)
        const state = organisation.organisation_id;
        const pathname = "./SignUpOrgUsers"
        
        navigate(pathname, {state})
    }

    return (
        <div>
            <div className="organisation-details">
                { organisation && (
                    <article>
                        <h2>{ organisation.orgname }</h2> 
                        <p>Created { formatDistanceToNow(new Date(organisation.createdAt), { addSuffix: true }) } by { organisation.created_by }</p>
                        <div>
                            <p><strong>Project Description: </strong></p>
                            <p>{ organisation.detail }</p>
                        </div>
                        { user.role === 'Super Admin' && <button onClick={ handleClick }>Delete</button> } 
                        <br/>
                        { user.role === 'Super Admin' && <button className="signUpBtn" onClick={handleSignUpUser}>Create Employee/Project Admin account for {organisation.orgname}</button> }
                    </article>
                )}
            </div>
            <div>
                {showUsersPanel(user)}
                <div className="all-users">
                    <h2>Organisation Users</h2>
                    <div>  
                        <input className="search-input" type="search" placeholder="Search User" onChange={(e) => setSearch(e.target.value)} />  
                        {deleteUserButton()}
                        <br/>
                        <table>
                            {renderSearchResults}
                        </table>
                        
                        {deleteUserError && <p>Error: {deleteUserError}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default OrganisationDetails;