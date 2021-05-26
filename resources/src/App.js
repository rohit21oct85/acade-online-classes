import React from 'react'
import {
BrowserRouter as Router,
Switch,
Route,
} from "react-router-dom";
import Navigation from './components/Navigation.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

import PrivateRoute from './helper/PrivateRoute.jsx';
import AdminRoute from './helper/AdminRoute.jsx';

import { webRoutes, privateRoutes, adminRoutes, schoolAdminRoutes } from './routes/index.jsx';

import AuthProvider from './context/AuthContext.jsx';
import { ToastProvider } from 'react-toast-notifications';

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
export default function App() {
return (
<Router>
  <div className="wrapper">
    <div className="row no-gutters">
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <ToastProvider>
    <Navigation />
    <React.StrictMode>
    <Switch>
    {webRoutes?.map((route => (
        <Route exact={true} key={route.path} path={route.path} component={route.component} />
    )))}

    {privateRoutes?.map((route => (
      <PrivateRoute exact={true} key={route.path} path={route.path} component={route.component} />
    )))}

    {adminRoutes?.map((route => (
      <AdminRoute exact={true} key={route.path} path={route.path} component={route.component} />
    )))}


    </Switch>
    </React.StrictMode>
    </ToastProvider> 
    </AuthProvider>  
    </QueryClientProvider>
</div>
  </div>
</Router>


);
}

