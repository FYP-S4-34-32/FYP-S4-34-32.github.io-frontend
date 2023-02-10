//===========//
// Home page // --> To decide what to display upon logging in
//===========//

// imports
import { useAuthenticationContext } from "../hooks/useAuthenticationContext"

const Home = () => {
    const { user } = useAuthenticationContext()

    return (
        <div className="user-details">
            <h4>User Info - testing</h4>
            <p><strong>Email: </strong>{user.email}</p>
            <p><strong>Token: </strong>{user.token}</p>
        </div>
    )
}

export default Home