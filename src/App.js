//====================================//
// Main component for our Application //
//====================================//

// react-dom
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// pages and components
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import CreateProject from './pages/CreateProject';
import Projects from './pages/Projects';
import PageNotFound from './pages/PageNotFound';
import { useAuthenticationContext } from './hooks/useAuthenticationContext';
import AllUsers from './pages/AllUsers';
import ProjectDetails from './components/ProjectDetails';
import AssignedProjects from './pages/AssignedProjects';
import SelectPreference from './pages/SelectPreference';
import Organisations from './pages/Organisations';
import OrganisationDetails from './components/OrganisationDetails';
import ForgotPassword from './pages/ForgotPassword';
import UserDetails from './components/UserDetails';
import CreateOrganisation from './pages/CreateOrganisation';
import SignUpOrgUsers from './components/SignUpOrgUsers';
import EditProject from './components/EditProject';
import Assignment from './pages/Assignment';
import AssignmentDetails from './components/AssignmentDetails';
import OrganisationSkills from './pages/OrganisationSkills';

function App() {
  const { user } = useAuthenticationContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path = "/" // home page
              element = { (user && user.role === "Super Admin") ? <Navigate to="/organisations" /> : (user && user.role === "Admin") || (user && user.role === "Employee") ? <Navigate to="/projects" /> :<Navigate to="/login" /> } // Projects page if user is employee or project admin, organisations page if user is super admin, Login page if there is no user
            />  
            <Route 
              path = "/login" // login page
              element = { !user ? <Login /> : (user && user.role === "Super Admin") ? <Navigate to="/organisations" /> : <Navigate to="/projects" /> } // Projects page if there is a user, Login page if there is no user
            />
            <Route 
              path = "/signup" // signup page
              element = { (user && user.role === "Admin") || (user && user.role === "Super Admin") ? <Signup /> : <Navigate to="/projects" /> } // Sign up page if user is an Admin or Super Admin else Projects page
            />
            <Route 
              path = "/profile" // signup page
              element = { user ? <Profile /> : <Navigate to="/login" /> } // Profile page if there is a user, Login page if there is no user
            />
            <Route 
              path = "/createproject" // create project page
              element = { (user && user.role === "Admin") ? <CreateProject /> : <Navigate to="/login" /> } // Profile page if there is a user and is of role Admin, Login page if there is no user
            />
            <Route
              path = "/projects" // projects page
              element = { (user && user.role === "Admin") || (user && user.role === "Employee") ? <Projects /> : <Navigate to="/login" /> } // Projects page if there is a user, Login page if there is no user
            />
            <Route 
              path = "/createorganisation" // signup page
              element = { (user && user.role === "Super Admin") ? <CreateOrganisation /> : <Navigate to="/organisations" /> } // Create Organisations page if user is super admin
            />
            <Route
              path = "/organisations" // organisations page
              element = { (user && user.role === "Super Admin") ? <Organisations /> : <Navigate to="/login" /> } // Organisations page if user is super admin, Login page if there is no user
            />
            <Route 
                path = "/organisations/:id" // single organisation page
                element = { (user && user.role === "Super Admin") ? <OrganisationDetails /> : <Navigate to="/login" /> } // OrganisationDetails page if user is super admin, Login page if user is not super admin
            />
            <Route
              path = "/organisations/:id/signUpOrgUsers" // projects page
              element = { (user && user.role === "Super Admin") ? <SignUpOrgUsers /> : <Navigate to="/login" /> } // Signup page if user is super admin, Login page if there is no user
            />
            <Route 
                path = "/projects/:id" // single project page
                element = { user ? <ProjectDetails /> : <Navigate to="/login" /> } // ProjectDetails page if there is a user, Login page if there is no user
            />
            <Route 
                path = "/projects/editproject/:id" // edit project
                element = { user ? <EditProject /> : <Navigate to="/login" /> }
            />
            <Route
              path = "/allusers" // all users page 
              element = { ((user && user.role === "Super Admin") || (user && user.role === "Admin")) ? <AllUsers /> : <Navigate to="/login" /> } // Home page if there is a user and is of role Super Admin, Login page if there is no user
            />
            <Route 
              path = "/UserDetails/:id" // single user page
              element = { ((user && user.role === "Super Admin") || (user && user.role === "Admin")) ? <UserDetails /> : <Navigate to="/login" /> } // UserDetails page if there is a user and is of role Super Admin or Admin, Login page if there is no user
            />
            <Route
              path = "/assignedprojects" // assigned projects page
              element = { (user && user.role === "Employee") ? <AssignedProjects /> : <Navigate to="/login" /> } // Projects page if there is a user and is of role Employee, Login page if there is no user
            />
            <Route 
              path = "/selectpreference" // preference selection page
              element = { (user && user.role === "Employee") ? <SelectPreference/> : <Navigate to="/login" /> }
            />
            <Route
              path = "/forgotpassword" // reset password page
              element = { <ForgotPassword /> }
            />
            <Route 
                path = "/assignment" // project assignment page
                element = { <Assignment /> }
            />
            <Route 
                path = "/assignment/:id" // single project page
                element = { user ? <AssignmentDetails /> : <Navigate to="/login" /> } // AssignmentDetails page if there is a user, Login page if there is no user
            />
            <Route
              path = "/organisationskills" // organisation skills page
              element = { (user && user.role === "Admin") ? <OrganisationSkills /> : <Navigate to="/login" /> } // OrganisationSkills page if there is a user and is of role Super Admin, Login page if there is no user
            />
            <Route
              path = "*" // 404 page
              element = { <PageNotFound /> }
            /> 
            
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
