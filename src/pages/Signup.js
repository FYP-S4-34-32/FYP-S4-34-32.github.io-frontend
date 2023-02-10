//=============//
// Signup Page //
//=============//

// imports
import { useState, useEffect } from 'react'
import { useSignup } from '../hooks/useSignup'
import { useAuthenticationContext } from '../hooks/useAuthenticationContext'
import { useGetAllOrganisations } from '../hooks/useGetAllOrganisations'

const Signup = () => {
    const { user } = useAuthenticationContext()
    const currentUserRole = user.role

    // another layer of  check
    if (currentUserRole !== 'Admin' && currentUserRole !== 'Super Admin') {
        throw Error('You are not authorised to view this page')
    }

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('')
    const [organisation, setOrganisationID] = useState('')
    const { signup, isLoading, error, successMsg} = useSignup() // from useSignup.js in the hooks folder
    const { getAllOrganisations, getAllOrganisationsIsLoading, getAllOrganisationsError, allOrganisations } = useGetAllOrganisations() // get the getAllOrga

    var organisationsArray = allOrganisations; 

    useEffect(() => { 

        if (user && user.role === "Super Admin") // only super admins can see all organisations, hence only get all organisations if user is a super admin
            getAllOrganisations(user); 
    }, [])
 

    const handleSubmit = async (e) => {
        // prevent refresh upon submit
        e.preventDefault()

        // invoke signup function from useSignup.js
        if (user.role === "Admin") // if user is a project admin, set organisation to the project admin's organisation
            await signup(name, email, password, confirmPassword, role, user.organisation_id) 
        else 
            if (user.role === "Super Admin") // if user is a super admin, set organisation to the organisation selected by the super admin
                if (role === "Super Admin"){
                    await signup(name, email, password, confirmPassword, role, "Undefined")
                } else {
                await signup(name, email, password, confirmPassword, role, organisation)
                }

        // reset form
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setRole('')
        setOrganisationID('')
    }
 
    // only display the organisation dropdown if the user is a super admin
    const displayOrganisationOptions = organisationsArray.map((organisation) => {
            return (
                <option key={organisation._id} value={organisation.organisation_id}> {organisation.organisation_id} </option>
            )
    })  

    // return a template - signup form
    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Account Creation</h3>
            <label>Name:</label>
            <input
                type="text"
                onChange={(e) => {setName(e.target.value)}} // set name to the value of the target input field
                value={name} // reflect change in name state
            />
            <label>Email:</label>
            <input
                type="email"
                onChange={(e) => {setEmail(e.target.value)}} // set email to the value of the target input field
                value={email} // reflect change in email state
            />
            <label>Organisation:</label>
            
            {/* If user is a PROJECT ADMIN: disable input field, organisation is same as project admin's organisation */}
            {user.role === "Admin" && 
                <input
                    type="organisation"
                    disabled={true} 
                    value={user.organisation_id}
                />
            }   

            {/* If user is a SUPER ADMIN: enable input field, organisation can be changed */}
            {user.role === "Super Admin" && role !== "Super Admin" &&
                <select value={organisation} onChange={(e) => {setOrganisationID(e.target.value)}}>
                    <option value="">Please choose an organisation</option> {/* included this so that user will be forced to make a selection otherwise function returns role=null --> creation will not take place */}
                    {displayOrganisationOptions}
                    <option value="Undefined">Null</option>
                </select>
            }        

            {/* If role selected is Super Admin, Organisation will be defaulted to undefined */}
            {currentUserRole === "Super Admin" && role === "Super Admin" && 
                <input
                type="organisation"
                disabled={true} 
                value = "Undefined"
                />
            } 

            <br></br>
            <label>Password:</label>
            <input
                type="password" // hidden
                onChange={(e) => {setPassword(e.target.value)}} // set password to the value of the target input field
                value={password} // reflect change in password state
            />
            <label>Confirm Password:</label>
            <input
                type="password" // hidden
                onChange={(e) => {setConfirmPassword(e.target.value)}} // set password to the value of the target input field
                value={confirmPassword} // reflect change in password state
            />
            <label>Role:</label>
            <select value={role} onChange={(e) => {setRole(e.target.value)}}>
                <option value="">Please choose one</option> {/* included this so that user will be forced to make a selection otherwise function returns role=null --> creation will not take place */}
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
                { (currentUserRole === "Super Admin") && <option value="Super Admin">Super Admin</option> } {/*only display the Super Admin option if the current user is one*/}   
            </select>
            <br></br>
            <br></br>
                
            <button disabled={ isLoading }>Sign up</button> {/*prevent button from being clicked while page is loading*/}
            {error && <div className="error">{ error }</div>}
            {successMsg && <div className="success">{ successMsg }</div>}
        </form>
    )
}

// EXPORT
export default Signup