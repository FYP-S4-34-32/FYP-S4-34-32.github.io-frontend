//==============//
// Profile page // --> to be updated again
//==============//

// imports 
import { useState, useEffect} from 'react'  
import { useAuthenticationContext } from '../hooks/useAuthenticationContext' 
import { useFetchProfile } from '../hooks/useFetchProfile'
import { useUpdateInfo } from '../hooks/useUpdateInfo' 
import { useChangePassword } from '../hooks/useChangePassword'
import { useUpdateSkills } from '../hooks/useUpdateSkills'  
import { useGetOrganisationSkills } from '../hooks/useGetOrgSkills'

const Profile = () => { 
    // hooks
    const { user } = useAuthenticationContext()    
    const { fetchProfile, fetchProfileIsLoading, fetchProfileError, profile } = useFetchProfile() // fetch user's profile info 
    const { getOrganisationSkills, allSkills } = useGetOrganisationSkills(); // fetch all skills defined for the organisation
    const {updateInfo, isLoading, error, updateContactSuccess} = useUpdateInfo()  
    const {changePassword, changePwIsLoading, changePwError, changePwSuccess} = useChangePassword()
    const {updateSkills, updateSkillsIsLoading, updateSkillsError} = useUpdateSkills()  
    var availSkillsArray = []; // available skills for user to select from

    // user's array of skills
    const [userObject, setUserObject] = useState(profile)     
    const [tempUserSkillsArr, setTempUserSkills] = useState(userObject.skills);

    // to fetch user's profile info upon page load and refresh
    useEffect(() => {
        fetchProfile(user.email);  
        setUserObject(profile);
        getOrganisationSkills(user.organisation_id);
    }, [])   

    // other variables
    const [selectedInfo, setSelectedInfo] = useState(''); 
    const [contactForm, setShowContactForm] = useState(false);  
    const [contact, setContact] = useState(profile.contact); 
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [skillsForm, setShowSkillsForm] = useState(false);
    const [finalSkillsArr, setCompetency] = useState(tempUserSkillsArr); 
    
    // DEFAULT competency levels for all skills
    const competencyLevels = [
        {value : "Beginner", label : "Beginner"}, 
        {value : "Intermediate", label : "Intermediate"},
        {value : "Advanced", label : "Advanced"}
    ]

    console.log("org skills: ", allSkills);

    // DEFAULT AVAILABLE SKILLS -> based on organisation's skills defined. 
    // will change based on user's current skills (check validateSkillsArray function)
    const initialiseAvailSkillsArray = () => {
        var temp = [];
        temp.push({skill: "0", label: "Select a skill"});

        for (var i = 0; i < allSkills.length; i++) {
            temp.push({skill: allSkills[i].skillName, label: allSkills[i].skillName});
        }

        return temp;
    }

    availSkillsArray = initialiseAvailSkillsArray();
    // console.log("avail skills: ", availSkillsArray);

    // DEFAULT available skills, will change based on user's current skills (check validateSkillsArray function)
    // var availSkillsArray = [ 
    //     {skill: "0", label: "Select a skill"},
    //     {skill: "Java", label: "Java"},
    //     {skill: "MongoDB", label: "MongoDB"},
    //     {skill: "React", label: "React"},
    //     {skill: "Node.js", label: "Node.js"},
    //     {skill: "Python", label: "Python"},
    //     {skill: "C++", label: "C++"},
    //     {skill: "C#", label: "C#"},
    //     {skill: "C", label: "C"},
    //     {skill: "PHP", label: "PHP"},
    //     {skill: "Ruby", label: "Ruby"},
    //     {skill: "Swift", label: "Swift"}
    // ]

    // TOGGLE contact form
    const showContactForm = () => {
        setShowContactForm(!contactForm);
    };

    // validate availSkillsArray: should only have skills that are not already in userSkillsArr
    const validateSkillsArray = () => {
        
        var tempAvailSkillsArray = availSkillsArray;

        for (var i = 0; i < tempUserSkillsArr.length; i++) {
            for (var j = 0; j < tempAvailSkillsArray.length; j++) {
                if (tempUserSkillsArr[i].skill === tempAvailSkillsArray[j].skill) {
                    tempAvailSkillsArray.splice(j, 1);
                }
            }
        } 
        availSkillsArray = JSON.parse(JSON.stringify(tempAvailSkillsArray)); 
    }

    

    // EDIT SKILLS
    const editSkills = () => {
        setCompetency([...profile.skills]);
        setTempUserSkills([...profile.skills]);  

        setShowSkillsForm('editSkills');
    }
 
    // UPDATE SKILL COMPETENCY LEVEL
    const changeCompetency = index => (e) => {  
        let temp = JSON.parse(JSON.stringify(tempUserSkillsArr)); // deep copy of finalSkillsArr
        temp[index].competency = e.target.value; // replace e.target.value with competency level selected 

        setTempUserSkills([...temp]);
        setCompetency(temp);  
    }

    // CANCEL EDIT SKILLS
    const cancelEditSkills = () => {
        setCompetency([...profile.skills]);
        setTempUserSkills([...profile.skills]);  

        setShowSkillsForm('showSkills');
    }

    // ADD A NEW SKILL
    const addSkill = (e) => { 
        let temp = [...tempUserSkillsArr]; 
        temp.push({skill: e.target.value, competency: "Beginner"}); 

        setTempUserSkills([...temp]);
        setCompetency([...temp]);  
    }

    // DELETE A SKILL
    const deleteSkill = (index) => { 
        let temp = [...tempUserSkillsArr]; 
        temp.splice(index, 1);  
 
        setTempUserSkills([...temp]);
        setCompetency([...tempUserSkillsArr]);    
    }
     
    // TO HANDLE SUBMITTING OF CONTACT INFO
    const handleSubmitContactInfo = async(e) => {
        e.preventDefault();

        setSelectedInfo('showUser');
        showContactForm();
        setContact(await updateInfo(user.email, contact));

        // to update user's profile after editing and saving contact info
        fetchProfile(user.email);  
        setUserObject(profile);
    }

    // HANDLE SUBMITTING OF SKILLS 
    const handleSubmitSkills = async(e) => {
        e.preventDefault();   
        
        let userObj = await updateSkills(user.email, finalSkillsArr);  // to update user's skills
        fetchProfile(user.email);  // to fetch user's profile since it was updated
        
        setUserObject(userObj);
        setCompetency([...userObj.skills]);
        setTempUserSkills([...userObj.skills]);  

        setShowSkillsForm('showSkills');
    }

    // HANDLE CHANGING OF PASSWORD
    const handleSubmitPassword = async(e) => {
        e.preventDefault(); 
 
        await changePassword(user.email, currentPassword, newPassword, confirmPassword);
    } 

    // ========================================================================================================
    // PAGE CONTENT
    // ========================================================================================================

    // to render skills section 
    const showSkills = () => {  
        validateSkillsArray();    
 
        // select skills
        var showAvailSkills = availSkillsArray.map((availSkill) => {
            return (
                <option key={ availSkill.skill } value={ availSkill.skill }>{ availSkill.label }</option>
            )
        })

        // show skills (current -> from profile.skills)
        var showSkillRows = profile.skills.map((s) => {
            return (
                <p key={ s.skill }>{ s.skill }: { s.competency }</p>
            )
        }) 

        // select competency levels for current skills
        var editingSkillsCompetency = finalSkillsArr.map((datum, index) => {
            var skill = datum.skill;
            var competency = datum.competency;

            if (competency === "Beginner") {
                competency = competencyLevels[0].value;
            }
            else if (competency === "Intermediate") {
                competency = competencyLevels[1].value;
            }
            else if (competency === "Advanced") {
                competency = competencyLevels[2].value;
            }
            else {
                competency = competencyLevels[0].value;
            }

            return (
                <p key={ skill }>{ skill }  
                    <select className="skillSelection" defaultValue={competency} onChange={changeCompetency(index)}>
                        <option value={competencyLevels[0].value}>{competencyLevels[0].label}</option>
                        <option value={competencyLevels[1].value}>{competencyLevels[1].label}</option>
                        <option value={competencyLevels[2].value}>{competencyLevels[2].label}</option>
                    </select>
                    <span className="material-symbols-outlined" onClick={() => deleteSkill(index)} style={{marginLeft:"20px"}}>delete</span> 
                 </p>
            )
        })

        switch (skillsForm) {
            case 'showSkills': // show skills
                return (
                    <div>
                        { showSkillRows }
                        <button className="editSkillsBtn" onClick={() => editSkills()}>Edit Skills</button>
                    </div>
                ) 

            case 'editSkills': // editing skill competency 
                
                return (
                    <div>  
                        <form className='editSkillsForm'>
                            <h3>Add New Skills</h3>
                            <div> 
                                <select className="skillSelection" onChange={addSkill}>
                                    {showAvailSkills}
                                </select>
                            </div>
                            <hr></hr>
                            <h3>Edit Skills Competency</h3>

                            {editingSkillsCompetency}

                            <br></br>
                            <button className="cancelBtn" style={{float:"left"}} onClick={() => cancelEditSkills()}>Cancel</button>
                            <button className="submitBtn" disabled={ updateSkillsIsLoading } onClick={handleSubmitSkills}>Submit</button>
                            {updateSkillsError && <p>{updateSkillsError}</p>}
                        </form>
                    </div> 
                )
            default: // display user skills
                return (
                    <div>
                        { showSkillRows }
                        <button className="editSkillsBtn" onClick={() => editSkills()}>Edit Skills</button>
                    </div>
                )
        }
    }

    // LEFT DIVIDER: INFO PANEL
    // where user can select what info to view
    const infoPanel = () => {
        switch(user.role) {
            case "Employee":
                return (
                    <div className="profile-panel" style={{height: '240px'}}> 
                        <button onClick={() => setSelectedInfo('showUser')}> User Information </button>
                        <button onClick={() => setSelectedInfo('showOrganisation') }> Organisation </button>
                        <button onClick={() => setSelectedInfo('showSkills')}> Skills </button>  
                        <button onClick={() => setSelectedInfo('projectPreferences')} > Project Preferences </button>
                        <button onClick={() => setSelectedInfo('changePassword')} > Change Password </button>
                    </div> 
            )
            case "Admin":
                return (
                    <div className="profile-panel" style={{height:'150px'}}>
                        <button onClick={() => setSelectedInfo('showUser')}> User Information </button>
                        <button onClick={() => setSelectedInfo('showOrganisation') }> Organisation </button>
                        <button onClick={() => setSelectedInfo('changePassword')} > Change Password </button>
                    </div>
            )
            case "Super Admin":
                return (
                    <div className="profile-panel" style={{height:'100px'}}>
                        <button onClick={() => setSelectedInfo('showUser')} > User Information </button> 
                        <button onClick={() => setSelectedInfo('changePassword')} > Change Password </button>
                    </div>
            )
            default:
                return (<div className="profile-panel"> </div>) 
        }
    }

    // RIGHT DIVIDER: SHOWS USER INFORMATION
    // where user can view and edit their information
    const showSelectedInfo = () => {
        switch(selectedInfo) {
            case 'showOrganisation':
                return (
                    <div className="user-profile">
                        <h2> Organisation Information </h2>  
                        <p> Organisation Name: {profile.organisation_id} </p>
                    </div>
                )
                
            case 'showSkills':    
                return (
                    <div className="user-profile">
                        
                        <h2> Skills </h2>  
                        {showSkills()}
                    </div> 
                )    
            
            // show employee's project preferences
            case 'projectPreferences':
                return (
                    <div className="user-profile">
                        <h2> Project Preferences </h2>
                        {profile.firstChoice && <p> First Choice: <br/>  <br/> {profile.firstChoice} </p>}
                        <hr/>
                        {profile.secondChoice && <p> Second Choice: <br/> <br/> {profile.secondChoice} </p>}
                        <hr/>
                        {profile.thirdChoice && <p> Third Choice: <br/> <br/> {profile.thirdChoice} </p>}
                    </div>
                )

            case 'changePassword':
                return (
                    <div className="user-profile">
                    <h2> Change Password </h2>
                    <form className="changePwdForm" onSubmit={handleSubmitPassword}>
                        <label> Current Password </label>
                        <input type="password" onChange={(e) => {setCurrentPassword(e.target.value)}}/>
                        <label> New Password </label>
                        <input type="password" onChange={(e) => {setNewPassword(e.target.value)}}/>
                        <label> Confirm New Password </label>
                        <input type="password" onChange={(e) => {setConfirmPassword(e.target.value)}}/>
                                
                        <button className="cancelBtn" style={{float:"left"}} onClick={() => setSelectedInfo('showUser')}>Cancel</button> 
                        <button className="submitBtn" disabled={ changePwIsLoading }> Submit </button>
                        <br></br><br></br>

                    <div className="bottomDiv" style={{ paddingTop: "20px" }}>
                        {changePwError && <div className="error"> {changePwError}</div>}
                        {changePwSuccess && <div className="success"> {changePwSuccess}</div>}
                    </div>
                    </form>
                    </div>

                )
             
            // DEFAULT: DISPLAY USER INFORMATION
            case 'showUser':
            default: 
                return (
                    <div className="user-profile"> 
                        <h2> User Information </h2>
            
                        <h4 > Full Name </h4>
                        { user && <p> { profile.name } </p>}  
            
                        <hr/>
            
                        <h4 > Email </h4>
                        { user && <p> { profile.email } </p>}  
            
                        <hr/>
            
                        <h4> Role </h4>
                        { user && <p> { profile.role } </p>}  
            
                        <hr/>
            
                        <h4> Contact Info</h4> { profile && <p style={{display:'inline'}}> { profile.contact }</p> }
                        <button className="editContactBtn" onClick={showContactForm}>Edit</button>

                        { contactForm && (
                            <form className='newContactForm' onSubmit={handleSubmitContactInfo}> 
                                <input type="contact" className="newContact" placeholder={"New contact information"} onChange={(e) => {setContact(e.target.value)}}/>
                                <button className="submitBtn" disabled={ isLoading }>Submit</button>
                                <button className="cancelBtn" onClick={showContactForm}>Cancel</button>
                            </form>
                        )}

                        {error && <div className="error"> {error} </div>}
                        {updateContactSuccess && <div className="success"> {updateContactSuccess} </div>}
                    </div>
                )
        }
    }
 
    return (
        <div>  
            {infoPanel()}

            {showSelectedInfo()}  
        </div>
    )
}

export default Profile 