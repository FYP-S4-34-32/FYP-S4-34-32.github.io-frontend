//============//
// Login Page //
//============//

// imports
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading } = useLogin() // from useLogin.js in the hooks folder
    const [passwordShown, setShowPassword] = useState(false); // show password

    const handleSubmit = async (e) => {
        // prevent refresh upon submit
        e.preventDefault()

        // invoke the login function from useLogin.js
        await login(email, password)
    }

    // show Password toggle 
    const showPassword = () => { 
        setShowPassword(!passwordShown);
    };

    // return a template - login form
    return (
        <form className="login" onSubmit={handleSubmit}>
            <h3>Login</h3>
            <label>Email:</label>
            <input
                type="email"
                onChange={(e) => {setEmail(e.target.value)}} // set email to the value of the target input field
                value={email} // reflect change in email state
            />
            <label>Password:</label>
            <input
                type={passwordShown ? "text" : "password"}  // hidden
                onChange={(e) => {setPassword(e.target.value)}} // set password to the value of the target input field
                value={password} // reflect change in password state
            />
            <button className="showPwBtn" type="button" onClick={showPassword}>Show Password</button>

            <button disabled={ isLoading } style={{float:"right"}}>Login</button> {/*prevent button from being clicked while page is loading*/}
            <br/>
            <br/>
            <Link to="/forgotpassword" style={{fontSize:"0.9em"}}>Forgot Password</Link> {/*link to register page*/}

            {error && <div className="error">{ error }</div>}
        </form>
    )
}

// EXPORT
export default Login