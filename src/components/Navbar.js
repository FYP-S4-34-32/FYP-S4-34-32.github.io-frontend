//=======================================//
// Navigation Bar at the top of the page //
//=======================================//

// imports
import { Link, useNavigate } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthenticationContext } from '../hooks/useAuthenticationContext'

const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthenticationContext()
    const navigate = useNavigate()

    const handleLogoutClick = () => {
        logout()
        navigate("/login")
    }

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>Automatic Project Assignment</h1>
                </Link>
                <nav>
                    {(user && user.role === "Admin") && ( // return this template only when the logged in user is a project admin
                        <div>
                            <Link to="/assignment">Assignment</Link>
                            <Link to="/createproject">Create Project</Link>
                            <Link to="/organisationskills" >Organisation Skills</Link>
                            <Link to="/allusers">All Users</Link>
                            <Link to="/signup">Create Account</Link>
                        </div>
                    )}
                    {(user && user.role === "Super Admin") && ( // return this template only when the logged in user is a super admin
                        <div>
                            <Link to="/createorganisation">Create Organisation</Link>
                            <Link to="/signup">Create Account</Link>
                            <Link to="/allusers">All Users</Link>
                        </div>
                    )}
                    {user && user.role === "Employee" && (
                        <div>
                            <Link to="/projects">Project Listings</Link>
                            <Link to="/selectpreference">Select Preference</Link>
                            <Link to="/assignedprojects">Assigned Projects</Link>
                        </div>
                    )}
                    {user && ( // return a template only when there is a user logged in
                        <div>
                            <Link to="/profile">Profile</Link>
                            <button onClick={handleLogoutClick}>Log out</button>
                        </div>
                    )}
                    {!user && ( // return this template only when there is no user logged in
                        <div>
                            <Link to="/login">Login</Link>
                            {/* remove signup page */}
                            {/* <Link to="/signup">Signup</Link> */}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

// EXPORT
export default Navbar