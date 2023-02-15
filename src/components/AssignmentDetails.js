//=============================================================//
// Assignment Details page for an individual Assignment Object //
//=============================================================//

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthenticationContext } from "../hooks/useAuthenticationContext";
import { useAssignmentContext } from "../hooks/useAssignmentContext";
import { useGetAllUsers } from '../hooks/useGetAllUsers'
import { useGetAllProjects } from "../hooks/useGetAllProjects";
import { useUpdateEmployees } from '../hooks/useUpdateAssnEmployees'
import { useUpdateProjects } from "../hooks/useUpdateAssnProjects";
import { useUpdateActiveStatus } from "../hooks/useUpdateAssignmentStatus";
import { useAutomaticAssignment } from "../hooks/useAutomaticAssignment";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const AssignmentDetails = () => {
    const { user } = useAuthenticationContext()
    const { assignment, dispatch: setAssignment } = useAssignmentContext()
    const { getAllUsers, allUsers } = useGetAllUsers() // get the getAllUsers function from the context
    const { getAllProjects, allProjects} = useGetAllProjects() // getAllProjects from context
    const [selectedInfo, setSelectedInfo] = useState(''); 
    const [EmployeesForm, setShowEmployeesForm] = useState(false);
    const [ProjectsForm, setShowProjectsForm] = useState(false);
    const { updateEmployees, updateEmployeesError, updateEmployeesIsLoading } = useUpdateEmployees()
    const { updateActiveStatus, updateStatusIsLoading, updateStatusError} = useUpdateActiveStatus()
    const { updateProjects } = useUpdateProjects()
    const { automaticAssignment } = useAutomaticAssignment();
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const uniqueKey = Date.now();

    const { id } = useParams()

    var allUsersArray = []
    var organisationUsersArray = []
    var allProjectsArray = []
    var organisationProjectsArray = []

    // Assignment array of employees and projects  
    const [tempAssignmentProjectsArr, setTempAssignmentProjects] = useState([]);
    const [tempAssignmentEmployeesArr, setTempAssignmentEmployees] = useState([]);
    const [addEmployeeArr, setAddEmployeeArr ] = useState([]);
    const [addProjectArr, setAddProjectArr ] = useState([]);
    const [message, setMessage] = useState("");

    var availEmployeesArray = []; // available list of employees for admin to select from
    var availProjectsArray = []; // available list of projects for the admin to select from
    
    
    // fires when the component is rendered
    useEffect(() => {

        // if there is an authenticated user
        if (user) {
            fetchAssignment()
        }
    }, [setAssignment, user, id])

    const fetchAssignment = async () => {
        const response = await fetch('https://fyp-22-s4-32.herokuapp.com/api/assignment/' + id, { // fetch the assignment based on the assignment's id
            headers: {
                'Authorization': `Bearer ${ user.token }` // sends authorisation header with the user's token -> backend will validate token -> if valid, grant access to API
            }
        }) // using fetch() api to fetch data and store in the variable

        const json = await response.json() // response object into json object

        // response OK
        if (response.ok) {
            setAssignment({ type: 'SET_ONE_ASSIGNMENT', payload: json})
        }
    }

    useEffect(() => {
        getAllUsers();
        getAllProjects(user);
    }, []) 

    //filter users to match with current organisation id and ensure they are not enrolled in an assignment already
    const filterOrganisationUsers = () => {
        if (user.organisation_id !== undefined) {
            allUsersArray = allUsers
            if (user.role !== "Employee") {
                for (var i = 0; i < allUsersArray.length; i++) {
                    if (allUsersArray[i].role === "Employee" && allUsersArray[i].organisation_id === assignment.organisation_id && allUsersArray[i].current_assignment == null) {
                        organisationUsersArray.push(allUsers[i])
                    }
                }
                setTempAssignmentEmployees(organisationUsersArray);
            }
        }
    }

    // DEFAULT AVAILABLE LIST OF EMPLOYEES
    // will change based on current list of added employees
    const initialiseAvailEmployeesArray = () => {
        var temp = [];
        temp.push({name: "0", label: "Select an Employee"});

        for (var i = 0; i < tempAssignmentEmployeesArr.length; i++) {
            temp.push({name: tempAssignmentEmployeesArr[i].name, email: tempAssignmentEmployeesArr[i].email  });
        }
 
        return temp;
    }

    availEmployeesArray = initialiseAvailEmployeesArray();
    
    // validate add employees list: should only have employees that are not already in array
    const validateAssignmentEmployeeArr = () => {
        var tempAssnEmployeesArr = availEmployeesArray; 

        for (var i = 0; i < addEmployeeArr.length; i++) {
            for (var j = 0; j < tempAssnEmployeesArr.length; j++) {
                if (addEmployeeArr[i].email === tempAssnEmployeesArr[j].email) {
                    tempAssnEmployeesArr.splice(j, 1);
                }
            }
        }
        availEmployeesArray = JSON.parse(JSON.stringify(tempAssnEmployeesArr));  
    }

    //filter projects to match with current organisation id and are not already assigned 
    const filterOrganisationProjects = () => {
        if (user.organisation_id !== undefined) {
            allProjectsArray = allProjects
            if (user.role !== "Employee") {
                for (var i = 0; i < allProjectsArray.length; i++) {
                    if (allProjectsArray[i].organisation_id === assignment.organisation_id && allProjectsArray[i].assignment == null) {
                        organisationProjectsArray.push(allProjects[i].title)
                    }
                }
                setTempAssignmentProjects(organisationProjectsArray);
            }
        }
    }

    // DEFAULT AVAILABLE LIST OF PROJECTS
    // will change based on current list of added projects
    const initialiseAvailProjectsArray = () => {
        var temp = [];
        temp.push("Select a Project");

        for (var i = 0; i < tempAssignmentProjectsArr.length; i++) {
            temp.push(tempAssignmentProjectsArr[i]);
        }

        return temp;
    }

    availProjectsArray = initialiseAvailProjectsArray();

    // validate add projects list: should only have project that are not already in array
    const validateAssignmentProjectArr = () => {
        var tempAssnProjectsArr = availProjectsArray; 

        for (var i = 0; i < addProjectArr.length; i++) {
            for (var j = 0; j < tempAssnProjectsArr.length; j++) {
                if (addProjectArr[i] === tempAssnProjectsArr[j]) {
                   tempAssnProjectsArr.splice(j, 1);
                }
            }
        }
       availProjectsArray = JSON.parse(JSON.stringify(tempAssnProjectsArr));  
    }

    // EDIT EMPLOYEES LIST
    const editEmployees = () => {
        filterOrganisationUsers(); 
        validateAssignmentEmployeeArr();
        setAddEmployeeArr([...assignment.employees]);
        
        setShowEmployeesForm('editEmployees');
    }

    // CANCEL EDIT EMPLOYEES LIST
    const cancelEditEmployees = () => {
        setTempAssignmentEmployees([...assignment.employees]);  

        setShowEmployeesForm('showEmployees');
    }

    // ADD A NEW EMPLOYEE
    const addEmployees = (e) => { 
        let temp = ([...addEmployeeArr]); 
        let selectedOption = JSON.parse(e.target.value);
        let newEmployee = {name: selectedOption.name, email: selectedOption.email};
        temp.push(newEmployee); 
        setAddEmployeeArr([...temp]);
    } 

    // DELETE AN EMPLOYEE
    const deleteEmployees = (index) => { 
        let temp = [...addEmployeeArr]; 
        let deletedEmployee = temp.splice(index, 1);  
        setAddEmployeeArr([...temp]);
        //setTempAssignmentEmployees([...addEmployeeArr])    

        // Move the deleted employee back to the availEmployeesArray
        availEmployeesArray = availEmployeesArray.filter(employee => employee.name !== '0')
        availEmployeesArray.push(deletedEmployee[0])
        setTempAssignmentEmployees([...availEmployeesArray]);
    }

    // HANDLE SUBMITTING OF EMPLOYEES 
    const handleSubmitEmployees = async(e) => {
        e.preventDefault();    
        
        await updateEmployees(user, id, addEmployeeArr);  // to update employees
        fetchAssignment() // to fetch Assignments since it was updated

        setShowEmployeesForm('showEmployees');
    }
    
    // EDIT PROJECTS LIST
    const editProjects = () => {
        filterOrganisationProjects(); 
        validateAssignmentProjectArr();
        setAddProjectArr([...assignment.projects]);
        
        setShowProjectsForm('editProjects');
    }

    // CANCEL EDIT PROJECTS LIST
    const cancelEditProjects = () => {
        setTempAssignmentProjects([...assignment.projects]);  

        setShowProjectsForm('showProjects');
    }

    // ADD NEW PROJECTS
    const addProjects = (e) => { 
        let temp = ([...addProjectArr]); 
        let selectedOption = JSON.parse(e.target.value);
        let newProject = (selectedOption);
        temp.push(newProject); 
        setAddProjectArr([...temp]);
    } 

    // DELETE AN EMPLOYEE
    const deleteProjects = (index) => { 
        let temp = [...addProjectArr]; 
        let deletedProject = temp.splice(index, 1);  
        setAddProjectArr([...temp]);  

        // Move the deleted employee back to the availEmployeesArray
        availProjectsArray = availProjectsArray.filter(project => project !== 'Select a Project')
        availProjectsArray.push(deletedProject[0])
        setTempAssignmentProjects([...availProjectsArray]);
    }

    // HANDLE SUBMITTING OF EMPLOYEES 
    const handleSubmitProjects = async(e) => {
        e.preventDefault();    
        
        await updateProjects(user, id, addProjectArr);  // to update projects
        fetchAssignment() // to fetch Projects since it was updated

        setShowProjectsForm('showProjects');
    }

    // HANDLE CHANGING OF ASSIGNMENT STATUS
    const changeActiveStatus = async(e) => {
        e.preventDefault();

        await updateActiveStatus(user, id); // to change assignment active status
        fetchAssignment()

        setShowProjectsForm('showProjects');
        setMessage("Assignment status changed successfully!");
    }

    // AUTOMATIC ASSIGNMENT BUTTON
    const processAutomaticAssignment = async(e) => {
        e.preventDefault();
        setMessage("Process is running, please be patient.");
    
        const { automaticAssignmentError } = await automaticAssignment(user, id);
        console.log("automaticAssignmentError", automaticAssignmentError)

        fetchAssignment()
    
        setShowProjectsForm('showProjects');

        if (automaticAssignmentError) {
            setError(automaticAssignmentError)
            setMessage("")
        }

        if (!automaticAssignmentError) {
            setMessage("Auto Assignment is complete!")
        }

            // setMessage("Automatic assignment for employees has been processed!");
         
            // if (automaticAssignmentError) {
            //     // Check if the error is from automaticAssignment hook
            //     setMessage(automaticAssignmentError);
            //     console.log("in catch block:", automaticAssignmentError)
            // } else {
            //     // If not, assign the general error message
            //     setMessage("Failed to load resource: the server responded with a status of 400 (Bad Request)");
            // }
            
        
    }
    
    
      
    
    const showData = () => {
        console.count('showData function call')
        let first_choice, second_choice, third_choice, not_assigned, not_selected, total_count;
            try {
                first_choice = JSON.parse(assignment.employee_got_first_choice);
                second_choice = JSON.parse(assignment.employee_got_second_choice);
                third_choice = JSON.parse(assignment.employee_got_third_choice);
                not_assigned = JSON.parse(assignment.employee_without_project);
                not_selected = JSON.parse(assignment.employee_got_not_selected);
                total_count = JSON.parse(assignment.employees.length);
                } catch (error) {
                console.error(error);
            return {
            error: "The automatic assignment has not been processed for this assignment, please run the process to view the overview statistics"
                }
            } 
        return {
            labels: ['first choice', 'second choice', 'third choice', 'not assigned', 'non-selected choice', 'total employee count'],
            datasets: [{
                label: 'Assignment Data',
                data: [first_choice, second_choice, third_choice, not_assigned, not_selected, total_count],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 255, 0, 0.2)' 
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 255, 0, 1)'
                ],
                borderWidth: 1
            }]
        };
    }
        

    // ========================================================================================================
    // PAGE CONTENT
    // ========================================================================================================

    // to render employees section
    const showEmployees = () => {  

        validateAssignmentEmployeeArr(); 

        // select Employees
        var showAvailEmployees = [...availEmployeesArray].map((datum, index) => {
            var availEmployee = datum;
            if (availEmployee.name === "0") {
                return (
                    <option key={ index } value={availEmployee.label}>{availEmployee.label} </option>
                )
            }
            else {
                return (
                    <option key={ index } value={JSON.stringify({name: availEmployee.name, email: availEmployee.email})}>{ availEmployee.name }, {availEmployee.email} </option>
                )
            }
           
        })

        // show Employees (current -> from assignment.employees)
        var showEmployeeRows = assignment.employees.map((employee, index) => {
            return (
                <p><li key={ index }>{ employee.name } - { employee.email }</li></p>
            )
        }) 

        // editing list of employees
        var editingEmployeeList = addEmployeeArr.map((employee, index) => {

            return (
                <li key={ index }>{ employee.name } - {employee.email}   
                    <span className="material-symbols-outlined" onClick={() => deleteEmployees(index)} style={{marginLeft:"20px"}}>delete</span> 
                 </li>
            )
        })

        switch (EmployeesForm) {
            case 'showEmployees': // show employees
                return (
                    <div>
                        { showEmployeeRows }
                        <button className="editEmployeesBtn" onClick={() => editEmployees()}>Edit Employees</button>
                    </div>
                ) 

            case 'editEmployees': // editing employees
                
                return (
                    <div>  
                        <form className='editEmployeesForm'>
                            <h3>Add New Employees</h3>
                            <div> 
                                <select className="employeeSelection" onChange={addEmployees} value="Select a user to be added"> 
                                    {showAvailEmployees}
                                </select>
                            </div>
                            <hr></hr>
                            <h3>Edit Employees List</h3>
                            { editingEmployeeList }
                            <br></br>

                            <button className="cancelBtn" style={{float:"left"}} onClick={() => cancelEditEmployees()}>Cancel</button>
                            <button className="submitBtn" onClick={handleSubmitEmployees}>Submit</button>
                            {/*updateEmployeesError && <p>{updateEmployeesError}</p>*/}
                        </form>
                    </div> 
                )
            default: // display assignment employees
                return (
                    <div>
                        { showEmployeeRows }
                        <button className="editEmployeesBtn" onClick={() => editEmployees()}>Edit Employees</button>
                    </div>
                )
        }
    }

    // To render projects section
    const showProjects = () => {
        validateAssignmentProjectArr();

        // select Projects
        var showAvailProjects = [...availProjectsArray].map((datum, index) => {
            var availProjects = datum;
            if (availProjects === "Select a Project") {
                return (
                    <option key={ index } value={availProjects}>{availProjects} </option>
                )
            }
            else {
                return (
                    <option key={ index } value={JSON.stringify(availProjects)}>{ availProjects } </option>
                )
            }
           
        })

        // show Projects (current -> from assignment.projects)
        var showProjectRows = assignment.projects.map((project, index) => {
            return (
                <p><li key={ index }>{ project }</li></p>
            )
        })

        // editing list of Projects
        var editingProjectList = addProjectArr.map((project, index) => {

            return (
                <li key={ index }>{ project }  
                    <span className="material-symbols-outlined" onClick={() => deleteProjects(index)} style={{marginLeft:"20px"}}>delete</span> 
                 </li>
            )
        })

        switch (ProjectsForm) {
            case 'showProjects': // show projects
                return (
                    <div>
                        { showProjectRows }
                        <button className="editProjectsBtn" onClick={() => editProjects()}>Edit Projects</button>
                    </div>
                ) 

            case 'editProjects': // editing projects
                
                return (
                    <div>  
                        <form className='editEmployeesForm'>
                            <h3>Add New Projects</h3>
                            <div> 
                                <select className="projectSelection" onChange={addProjects} value="Select a project to be added"> 
                                    {showAvailProjects}
                                </select>
                            </div>
                            <hr></hr>
                            <h3>Edit Projects List</h3>
                            { editingProjectList }
                            <br></br>

                            <button className="cancelBtn" style={{float:"left"}} onClick={() => cancelEditProjects()}>Cancel</button>
                            <button className="submitBtn" onClick={handleSubmitProjects}>Submit</button>
                            {/*updateEmployeesError && <p>{updateEmployeesError}</p>*/}
                        </form>
                    </div> 
                )
            default: // display assignment projects
                return (
                    <div>
                        { showProjectRows }
                        <button className="editProjectsBtn" onClick={() => editProjects()}>Edit Projects</button>
                    </div>
                )
        }
    }

    //To render the overview statistics
    const showStatistics = () => {
        const { error } =showData();
        return (
            <div className="showStatistics">
            {selectedInfo === 'showData' && assignment ?
            error ? <p>{error}</p> : <Bar key={uniqueKey} data={showData()} /> :
            null
            }
            </div>
        );
    }


    // LEFT DIVIDER: INFO PANEL
    // where user can select what info to view
    const infoPanel = () => {
                return (
                    <div className="selection-panel" style={{height:'200px'}}>
                        <button onClick={() => {setSelectedInfo('showAssignmentDetails'); setMessage("");}}> Assignment Details </button>
                        <button onClick={() => {setSelectedInfo('addProjects'); setMessage("");}}> Projects </button>
                        <button onClick={() => {setSelectedInfo('addEmployees'); setMessage("");}} > Employees </button>
                        <button onClick={() => {setSelectedInfo('showData'); setMessage("");}} > View Statistics </button>
                    </div>
            )
        }

    // RIGHT DIVIDER: SHOWS USER INFORMATION
    // where user can view and edit their information
    const showSelectedInfo = () => {
        switch(selectedInfo) {
            case 'addProjects':
                return (
                    <div className="assignment-profile">
                        
                        <h2> Current List of Assignments </h2>  
                        {showProjects()}
                    </div> 
                )
            case 'addEmployees':
                return (
                    <div className="assignment-profile">
                        
                        <h2> Current List of Employees </h2>  
                        {showEmployees()}
                    </div> 
                ) 
            case 'showData':
                return (
                    <div className="assignment-profile">

                        <h2> Overview Statistics </h2>
                        {showStatistics()}
                    </div>
                )
            // DEFAULT: DISPLAY USER INFORMATION
            case 'showAssignmentDetails':
            default: 
                return (
                    <div className="assignment-profile">
                        { assignment && (
                            <article>
                                <h2>{ assignment.title }</h2>
                                <button className="automaticAssignmentBtn" onClick={processAutomaticAssignment}>Process Automatic Assignment</button>
                                {error && <div className="error">{ error }</div>}
                                <p>Status: {assignment.active ? "Active" : "Inactive"}</p>
                                <p>Created { formatDistanceToNow(new Date(assignment.createdAt), { addSuffix: true }) } by { assignment.created_by }</p>
                                    <div>
                                        <p><strong>Projects in this assignment: </strong></p>
                                        <p>{assignment && assignment.projects.map((projects, index) => { 
                                            // will only run when there is a project object
                                            if (user.organisation_id === assignment.organisation_id)
                                            return(<li key={index}>{projects}</li>)})}
                                        </p>
                                        <p><strong>Employees in this assignment by email: </strong></p>
                                        <p>{ assignment && assignment.employees
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((employee, index) => { 
                                                if (user.organisation_id === assignment.organisation_id)
                                                return(<li key={index}>{employee.name} - {employee.email}</li>)})}
                                        </p>
                                    </div>
                                    <div>
                                        <button className="setActiveStatusBtn" onClick={changeActiveStatus}>Update Assignment Status</button>
                                        <br></br><br></br>
                                        {message && <div>{message}</div>}
                                    </div>
                            </article>
                         )}
                </div>
                )}}

    return (
    <div>
        {infoPanel()}
        {showSelectedInfo()}
    </div>    
        
    );
}
 
export default AssignmentDetails;
