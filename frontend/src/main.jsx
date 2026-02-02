
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './hooks/useUser';
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login.jsx';

import Register from './pages/Register.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AdmissionInformation from './admin/AdmissionInformation.jsx';
import Reception from './admin/Reception.jsx';
import Reports from './admin/Reports.jsx';
import ViewAgreements from './admin/ViewAgreements.jsx';
import ViewAgreementDetails from './admin/ViewAgreementDetails.jsx';



const router = createBrowserRouter([
  {
    path: "/", element: <App/>,
    children:[
        { path: '/login', 
          element: <Login/> },
          //   { path: '/Register', 
          // element: <Register/> },

  
           { path: '/admin-dashboard', 
          element: <AdminDashboard /> },
          { path: '/reception', 
          element: <Reception /> },
      
 

          { path: '/admissioninformation', 
          element: <AdmissionInformation /> },
          { path: '/reports', element: <Reports /> },
          {path: '/agreement',
          element: <ViewAgreements/>},
          {path : '/agreement/:id',
          element: <ViewAgreementDetails />},

        

         
    ]
  
  }
])
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>

    <Toaster />
    <RouterProvider router={router} />
    </UserProvider>

  </React.StrictMode>
);
