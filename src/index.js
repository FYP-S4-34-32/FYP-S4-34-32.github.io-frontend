//=============================================//
// Entry file for our frontend web application //
//=============================================//


// imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthenticationContextProvider } from './context/AuthenticationContext'
import { ProjectsContextProvider } from './context/ProjectContext';
import { OrganisationsContextProvider } from './context/OrganisationContext';
import { AssignmentContextProvider } from './context/AssignmentContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthenticationContextProvider>
        <AssignmentContextProvider>
            <ProjectsContextProvider>
                <OrganisationsContextProvider>
                    <App />
                </OrganisationsContextProvider>
            </ProjectsContextProvider>
        </AssignmentContextProvider>
    </AuthenticationContextProvider>
  </React.StrictMode>
);
