import React, { useState } from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import UserContext from './Contexts/UserContext';
import { EmployeeEditPage } from './pages/Config/EmployeeEditPage';
import { UserManagementPage } from './pages/Config/UserManagementPage';
import { NewsPage } from './pages/NewsPage';
import './styles/App.css';
import { Models } from './types/models';

function App() {

  const [ loggedInUser, setLoggedInUser ] = useState<Models.PersonWithLogin>();

  return (
    <UserContext.Provider value={loggedInUser}>
      <Layout>
        <Switch>
          <Route exact path="/">
            <NewsPage />
          </Route>
          <Route 
            exact path="/employees"
            render={_ => <UserManagementPage />}
          />
          <Route 
            exact path="/employees/:id/edit"
            render={props => <EmployeeEditPage {...props} />}
          />
          <Route 
            exact path="/employees/new"
            render={props => <EmployeeEditPage {...props} />}
          />
        </Switch>
      </Layout>
    </UserContext.Provider>
  );
}

export default App;
