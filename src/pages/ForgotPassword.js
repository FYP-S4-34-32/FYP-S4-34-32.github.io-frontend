// ========================= //
// Reset Password Page
// ========================= //

// imports
import { useState } from 'react' 
import { useValidateEmail } from '../hooks/useValidateEmail'  
import { useResetPassword } from '../hooks/useResetPassword' 
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
    const { validateEmail, invalidEmailError, isValidationLoading, message } = useValidateEmail() 
    const { resetPassword, resetPasswordLoading, resetPasswordError, resetPasswordSuccess } = useResetPassword()
 
    const [email, setEmail] = useState('')  
    const [token, setToken] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('') 


    // Handle Submit to validate email
    const handleSubmit = async(e) => {  
        e.preventDefault(); 

        // invoke validateEmail from useValidateEmail.js 
        await validateEmail(email);  
    }

    // Handle Submit to reset password
    const handleResetPassword = async(e) => {
        e.preventDefault(); 

        // invoke resetPassword from useResetPassword.js
        await resetPassword(email, token, password, confirmPassword)
    }

    const showForm = () => {
        if (resetPasswordSuccess === "Password Reset Successful") { // if successful, show success message and link to login page
            return (
                <div>
                    <form className="resetPasswordForm">
                        <div className="success">{ resetPasswordSuccess }</div>
                        <br/>
                        <Link to="/login">Login</Link>
                    </form>
                </div>
            )
        }
        else {
            return (
                <div>
                    <form className="resetPasswordForm" onSubmit={(e) => handleSubmit(e)}>
                        <h2>Forgot Password</h2>
                        <br></br>
                        <span>Enter your email address to reset your password.</span>
                        <br/>
                        <br/>
                        <label>Email Address:</label>
                        <input
                            type="email"
                            name="email"
                            onChange={(e) => {setEmail(e.target.value)}} // set email to the value of the target input field
                            value={email} // reflect change in email state
                        />
                        <button disabled={ isValidationLoading }>Submit</button> 
                        
                        {invalidEmailError && <div className="error">{ invalidEmailError }</div>} 
                        {message && <div className="success">{ message }. Please check your email inbox.</div>}
                        {message && <label>Token: </label>}
                        {message && <input
                            type="token"
                            name="token"
                            onChange={(e) => {setToken(e.target.value)}} // set email to the value of the target input field
                            value={token} // reflect change in email state
                        />}
                        {message && <label>New Password: </label>}
                        {message && <input
                            type="password"
                            name="password"
                            onChange={(e) => {setPassword(e.target.value)}} // set email to the value of the target input field
                            value={password} // reflect change in email state
                        />}
                        {message && <label>Confirm Password: </label>}
                        {message && <input 
                            type="password"
                            name="confirmPassword"
                            onChange={(e) => {setConfirmPassword(e.target.value)}} // set email to the value of the target input field
                            value={confirmPassword} // reflect change in email state
                        />}
                        {message && <button onClick={handleResetPassword} disabled={resetPasswordLoading}>Reset</button>}
                        {resetPasswordError && <div className="error">{ resetPasswordError }</div>}
                    </form>
                </div>
            )
        }


    }

    return (
        <div className="resetPassword">       
            {showForm()}
        </div>
    )
}

export default ForgotPassword