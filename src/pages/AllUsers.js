// ========================================================
// This page is used to display all users in the database
// ========================================================
// superadmin: can edit USER ROLES, can delete user accounts
// both superadmin and project admin: can edit USER CONTACT INFO, can delete EMPLOYEE accounts
// ========================================================

import { useState, useEffect} from 'react'   
import { useAuthenticationContext } from '../hooks/useAuthenticationContext'
import { useGetAllUsers } from '../hooks/useGetAllUsers'
import { useDeleteUser } from '../hooks/useDeleteUser' 
import { useDeleteUsers } from '../hooks/useDeleteUsers'
import { useGetAllOrganisations } from '../hooks/useGetAllOrganisations'
import { useNavigate} from 'react-router-dom' 

const AllUsers = () => {
    var allUsersArray = [] // all users in the database
    var projectAdminsArray = []
    var superAdminsArray = []
    var allEmployeesArray = [] 
    var organisationEmployeesArray = []
    var organisationsArray = []  
    const [deleteUsersArray, setDeleteUsersArray] = useState([]) // email addresses of users to be deleted (for mass deletion)
    
    const { user } = useAuthenticationContext() // get the user object from the context 
    const navigate = useNavigate();

    const { getAllUsers, getAllUsersIsLoading, getAllUsersError, allUsers } = useGetAllUsers() // get the getAllUsers function from the context 
    const { deleteOneUser, deleteUserIsLoading, deleteUserError, deleteUserSuccess} = useDeleteUser() // get the deleteUser function from the context
    const { getAllOrganisations, getAllOrganisationsIsLoading, getAllOrganisationsError, allOrganisations } = useGetAllOrganisations() // get the getAllOrganisations function from the context
    const { deleteUsers} = useDeleteUsers() // get the deleteUsers function from the context
    const [selectedUsers, setSelectedUsers] = useState("All Users") // for Super Admins
    const [selectedEmployees, setSelectedEmployees] = useState("Employees") // for Project Admins
    const [searchUsers, setSearch] = useState("")  
    const [filterOrgID, setFilterOrgID] = useState("All Organisations")  

    useEffect(() => {
        getAllUsers();

        if (user && user.role === "Super Admin") // only super admins can see all organisations, hence only get all organisations if user is a super admin
            getAllOrganisations(user); 
    }, []) 


    const filterUsers = (userArr) => {
        allUsersArray = userArr 

        if (user.role === "Super Admin") {
            for (var i = 0; i < allUsersArray.length; i++) {
                if (allUsersArray[i].role === "Admin") {
                    projectAdminsArray.push(allUsers[i])
                } else if (allUsersArray[i].role === "Super Admin") {
                    superAdminsArray.push(allUsers[i])
                } else if (allUsersArray[i].role === "Employee") {
                    allEmployeesArray.push(allUsers[i])
                }
            }
        }

        // organisation admin can only see employees in their OWN organisation
        if (user.role === "Admin") {
            for (var j = 0; j < allUsersArray.length; j++) {
                if (allUsersArray[j].role === "Employee" && allUsersArray[j].organisation_id === user.organisation_id) {
                    organisationEmployeesArray.push(allUsers[j])
                }
            }
        } 
    }

    filterUsers(allUsers);
    

    // DELETE a SINGLE USER from the database
    const deleteUser = async(email) => {  
        // CONFIRMATION BOX 
        let answer = window.confirm("Delete user " + email + "?");

        //console.log("answer: ", answer)
        if (answer) { // if user clicks OK, answer === true
            await deleteOneUser(email);
            getAllUsers(); // get updated array of users
            filterUsers(allUsers);
        } 
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
        if (user.role === "Super Admin" && selectedUsers === "Manage Users") {
            return (
                <div>
                    <button className="deleteUsersBtn" onClick={HandleDeleteUsers}>Delete Users</button>
                </div>
            )
        }

        if (user.role === "Admin" && selectedEmployees === "Manage Employees") {
            return (
                <div >
                    <button className="deleteUsersBtn" onClick={HandleDeleteUsers}>Delete Employees</button>
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
                filterUsers(allUsers); // filter the updated array of users
                
                if (user && user.role === "Super Admin") // only super admins can see all organisations, hence only get all organisations if user is a super admin
                    getAllOrganisations(user);  
            }  
        } 
    }

    // SEARCH for users
    const searchUser = () => {   
        // super admin
        if (user.role === "Super Admin") {
            if (selectedUsers === "All Users" || selectedUsers === "Manage Users" || selectedUsers === " " || selectedUsers === "" || selectedUsers === null || selectedUsers === undefined || !selectedUsers) { 
                
                // empty search query, no filter by organisation
                if ((searchUsers === "" || searchUsers === null || searchUsers === undefined || searchUsers === " " || !searchUsers) && (filterOrgID === "All Organisations" || filterOrgID === "" || filterOrgID === null || filterOrgID === undefined || !filterOrgID)) {
                    return allUsersArray;
                } 

                // empty search query, but filter by organisation
                if ((searchUsers === "" || searchUsers === null || searchUsers === undefined || searchUsers === " " || !searchUsers) && (filterOrgID !== "All Organisations" || filterOrgID !== "" || filterOrgID !== null || filterOrgID !== undefined || filterOrgID)) {
                    return allUsersArray.filter((user) => {
                        return (user.organisation_id) === filterOrgID;
                    });
                } 
                
                // search query, but no filter by organisation
                if (filterOrgID === "All Organisations" || filterOrgID === "" || filterOrgID === null || filterOrgID === undefined || !filterOrgID) {
                    return allUsersArray.filter((user) => {
                        return ( (user.name).toLowerCase().includes(searchUsers.toLowerCase()) || (user.email).toLowerCase().includes(searchUsers.toLowerCase()) );
                    });
                }

                // search query, and filter by organisation
                return allUsersArray.filter((user) => {   
                    return ( (user.name).toLowerCase().includes(searchUsers.toLowerCase()) || (user.email).toLowerCase().includes(searchUsers.toLowerCase()) ) && (user.organisation_id) === filterOrgID;
                });
            }

            if (selectedUsers === "Project Admins") { 

                // empty search query, no filter by organisation
                if ( (searchUsers === "" || searchUsers === null || searchUsers === undefined || searchUsers === " " || !searchUsers) && (filterOrgID === "All Organisations" || filterOrgID === "" || filterOrgID === null || filterOrgID === undefined || !filterOrgID) ) {
                    return projectAdminsArray;
                }

                // empty search query, but filter by organisation
                if ( (searchUsers === "" || searchUsers === null || searchUsers === undefined || searchUsers === " " || !searchUsers) && (filterOrgID !== "All Organisations" || filterOrgID !== "" || filterOrgID !== null || filterOrgID !== undefined || filterOrgID) ) {
                    return projectAdminsArray.filter((user) => {
                        return (user.organisation_id) === filterOrgID;
                    });
                } 

                // search query, but no filter by organisation
                if (filterOrgID === "All Organisations" || filterOrgID === "" || filterOrgID === null || filterOrgID === undefined || !filterOrgID) {
                    return projectAdminsArray.filter((user) => {
                        return ( (user.name).toLowerCase().includes(searchUsers.toLowerCase()) || (user.email).toLowerCase().includes(searchUsers.toLowerCase()) );
                    });
                }

                // search query, and filter by organisation
                return projectAdminsArray.filter((user) => {
                    return ( (user.name).toLowerCase().includes(searchUsers.toLowerCase()) || (user.email).toLowerCase().includes(searchUsers.toLowerCase()) ) && (user.organisation_id) === filterOrgID ;
                })
            }

            if (selectedUsers === "Super Admins") {  // DOES NOT BELONG TO ANY ORGANISATION
                
                if ( (searchUsers === "" || searchUsers === null || searchUsers === undefined || searchUsers === " " || !searchUsers ) && (filterOrgID === "All Organisations" || filterOrgID === "" || filterOrgID === null || filterOrgID === undefined || !filterOrgID) ) {
                    return superAdminsArray;
                } 
                
                return superAdminsArray.filter((user) => {
                    return ( (user.name).toLowerCase().includes(searchUsers.toLowerCase()) || (user.email).toLowerCase().includes(searchUsers.toLowerCase()) ) ;
                })
            }

            if (selectedUsers === "Employees") { 

                // empty search query, and no filter by organisation
                if ( (searchUsers === "" || searchUsers === null || searchUsers === undefined || searchUsers === " " || !searchUsers) && (filterOrgID === "All Organisations" || filterOrgID === "" || filterOrgID === null || filterOrgID === undefined || !filterOrgID)) {
                    return allEmployeesArray;
                }

                // empty search query, but filter by organisation
                if ( (searchUsers === "" || searchUsers === null || searchUsers === undefined || searchUsers === " " || !searchUsers) && (filterOrgID !== "All Organisations" || filterOrgID !== "" || filterOrgID !== null || filterOrgID !== undefined || filterOrgID) ) {
                    return allEmployeesArray.filter((user) => {
                        return (user.organisation_id) === filterOrgID;
                    });
                } 

                // search query, but no filter by organisation
                if (filterOrgID === "All Organisations" || filterOrgID === "" || filterOrgID === null || filterOrgID === undefined || !filterOrgID) {

                    return allEmployeesArray.filter((user) => {
                        return ( (user.name).toLowerCase().includes(searchUsers.toLowerCase()) || (user.email).toLowerCase().includes(searchUsers.toLowerCase()) );
                    });
                }
                
                // search query, and filter by organisation
                return allEmployeesArray.filter((user) => {
                    return ( (user.name).toLowerCase().includes(searchUsers.toLowerCase()) || (user.email).toLowerCase().includes(searchUsers.toLowerCase()) ) && (user.organisation_id) === filterOrgID ;
                })
            }
        }

        // project admins can only see employees in their OWN organisation 
        if (user.role === "Admin") {  

            if (selectedEmployees === "Employees" || selectedEmployees === "Manage Employees" ||  selectedEmployees === " " || selectedEmployees === "" || selectedEmployees === null || selectedEmployees === undefined || !selectedUsers) {
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

    // FILTER users by their organisations, only for Super Admins
    const OrganisationFilter = () => { 

        // selectable options for organisation filter 
        if (user.role === "Super Admin") { // super admins can see current organisations
            organisationsArray = allOrganisations; 

            const OrganisationFilterSelection = organisationsArray.map((organisation) => { 
                return (
                    <option key={organisation._id} value={organisation.organisation_id}>{organisation.organisation_id}</option>
                )
            })

            // super admins do not belong to any organisation. No need to filter by organisation
            if (selectedUsers !== "Super Admins") { 
                return (
                    <div className="filter">
                        <select className="filter-select" onChange={(e) => setFilterOrgID(e.target.value)} value={filterOrgID}>
                            <option value="All Organisations">All Organisations</option>
                            { OrganisationFilterSelection }
                        </select>
                    </div>
                )
            } 
        }
    }

    // pass user details to user details component
    const passUserDetails = (userDetails) => {
        //console.log("user details: ", userDetails)
        const id = userDetails._id;
        const pathname = `/UserDetails/${id}`
        const state = userDetails

        navigate(pathname, {state})  
    }

    // RENDER results
    const renderSearchResults = searchResults.map((datum) => {
        // for super admin
        if (user.role === "Super Admin") {
            switch (selectedUsers) {
                case "Manage Users":  // super admin
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
                                        <p>Role: {userDetails.role}</p>  
                                </td>
                                <td>
                                    <span className="material-symbols-outlined" id="deleteButton" onClick={() => deleteUser(userDetails.email)} style={{float:"right", marginRight:"30px"}}>delete</span>
                                </td>
                            </tr>
                        </tbody>
                    ) 
                default:
                    var userDetails = datum;
                    return (
                        <tbody key={userDetails._id}>
                            <tr className="user-cell"  style={{height:"210px"}} onClick={() => passUserDetails(userDetails)}>
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
        }

        else { 
            // for project admins
            switch (selectedEmployees) {
                case "Manage Employees": 
                    var userDetails = datum; 
                    return ( 
                        <tbody key={userDetails._id}>
                            <tr>
                                <td>
                                    <input className="checkBox" type="checkbox" value={userDetails.email} onChange={addDeleteUser}/>
                                </td>
                                <td className="user-cell" style={{height:"210px"}} onClick={() => passUserDetails(userDetails)}>
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
                            <tr className="user-cell"  style={{height:"210px"}} onClick={() => passUserDetails(userDetails)}>
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
        }
    }); 

    // panel that shows the types of users
    const showUsersPanel = (user) => {
        switch (user.role) {
            case "Super Admin":
                return (
                    <div className="selection-panel">
                        <button onClick={() => setSelectedUsers("All Users")}>All Users</button>
                        <button onClick={() => setSelectedUsers("Project Admins")}>Project Admins</button>
                        <button onClick={() =>setSelectedUsers("Super Admins")}>Super Admins</button>
                        <button onClick={() =>setSelectedUsers("Employees")}>Employees</button>
                        <button onClick={() =>setSelectedUsers("Manage Users")}>Manage Users</button>
                    </div>
                )
            case "Admin":
                return (
                    <div className="selection-panel" style={{height:"100px"}}> 
                        <button onClick={() =>setSelectedEmployees("Employees")}>Employees</button>
                        <button onClick={() =>setSelectedEmployees("Manage Employees")}>Manage Employees</button>
                    </div>
                )
        }
    }

    const displayShowMsg = () => {
        var display = selectedUsers;
        if (selectedUsers === "All Users") {
            display = "Users";
        }

        if (user.role === "Super Admin") {
            if (selectedUsers !== "Super Admins") {
                if (selectedUsers === "Manage Users") {
                    return (
                        <h4> Manage Users </h4>
                    )
                }
                else {
                    return (
                        <h4>Showing {searchResults.length} {display} from {filterOrgID} </h4>
                    )
                }
            } 
            else {
                return (
                    <h4>Showing {searchResults.length} {display} </h4>
                )
            }
        }

        if (user.role === "Admin") {
            if (selectedEmployees === "Manage Employees") {
                return (
                    <h4> Manage Employees </h4>
                )
            } else {
                return (
                    <h4>Showing {searchResults.length}  {selectedEmployees} from {user.organisation_id} </h4>
                )
            }
        } 
    }
 
    return (
        <div>
            {showUsersPanel(user)}
            <div className="all-users">
                <div>  
                    <input className="search-input" type="search" placeholder="Search User" onChange={(e) => setSearch(e.target.value)} />  
                    
                    {OrganisationFilter()} 

                    {deleteUserButton()}

                    {displayShowMsg()}

                    <table> 
                        {renderSearchResults} 
                    </table>
                    
                    {deleteUserError && <p>Error: {deleteUserError}</p>}
                </div>
            </div>
        </div>
    )

}

export default AllUsers