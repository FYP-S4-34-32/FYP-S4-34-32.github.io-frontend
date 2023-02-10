//=============//
// Signup Page //
//=============//

// imports
import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
import { useLocation } from 'react-router-dom'
import { useAuthenticationContext } from '../hooks/useAuthenticationContext'

const SignUpOrgUsers = () => {
    const { user } = useAuthenticationContext()
    const currentUserRole = user.role
    const location = useLocation(); 

    if (currentUserRole !== 'Super Admin') {
        throw Error('You are not authorised to view this page')
    }

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('')
    const [organisation_id, setOrganisation_id] = useState(location.state) // organisation_id is passed in from the previous page (organisation details page)
    const { signup, isLoading, error, successMsg} = useSignup() // from useSignup.js in the hooks folder

    const handleSubmit = async (e) => { 
        e.preventDefault()

        // invoke signup function from useSignup.js
        await signup(name, email, password, confirmPassword, role, organisation_id) 

        // reset form
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setRole('')
    }

    // return a template - signup form
    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Account Creation</h3>
            { (currentUserRole === 'Super Admin') && (
                <div>
                    <label>Organisation: {organisation_id}</label>
                    <br></br>
                </div>
            )}
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
            <input
                type="organisation"
                disabled={true} // disable input field, organisation is same as project admin's organisation
                value={organisation_id}
            />
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
export default SignUpOrgUsers