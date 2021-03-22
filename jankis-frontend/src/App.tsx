import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EmployeeEditPage } from './pages/Config/EmployeeEditPage';
import { UserManagementPage } from './pages/Config/UserManagementPage';
import { NewsPage } from './pages/NewsPage';
import './styles/App.css';

function App() {
  return (
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
  );
}

export default App;
