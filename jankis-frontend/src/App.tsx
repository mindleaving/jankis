import React, { useState } from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import UserContext from './contexts/UserContext';
import { DepartmentEditPage } from './pages/Departments/DepartmentEditPage';
import { DepartmentPage } from './pages/Departments/DepartmentPage';
import { DepartmentsListPage } from './pages/Departments/DepartmentsListPage';
import { NewsPage } from './pages/NewsPage';
import { CreatePatientPage } from './pages/Patients/CreatePatientPage';
import { MyPatientsPage } from './pages/Patients/MyPatientsPage';
import { PatientDiagnosticsPage } from './pages/Patients/PatientDiagnosticsPage';
import { PatientDocumentsPage } from './pages/Patients/PatientDocumentsPage';
import { PatientEquipmentPage } from './pages/Patients/PatientEquipmentPage';
import { PatientMedicationsPage } from './pages/Patients/PatientMedicationsPage';
import { PatientNotesPage } from './pages/Patients/PatientNotesPage';
import { PatientObservationsPage } from './pages/Patients/PatientObservationsPage';
import { PatientPage } from './pages/Patients/PatientPage';
import { PatientsListPage } from './pages/Patients/PatientsListPage';
import { PatientTimelinePage } from './pages/Patients/PatientTimelinePage';
import { ConsumableEditPage } from './pages/Resources/ConsumableEditPage';
import { ConsumablePage } from './pages/Resources/ConsumablePage';
import { ConsumablesListPage } from './pages/Resources/ConsumablesListPage';
import { ResourceEditPage } from './pages/Resources/ResourceEditPage';
import { ResourcePage } from './pages/Resources/ResourcePage';
import { ResourcesListPage } from './pages/Resources/ResourcesListPage';
import { StockEditPage } from './pages/Resources/StockEditPage';
import { StockPage } from './pages/Resources/StockPage';
import { StocksListPage } from './pages/Resources/StocksListPage';
import { RequestServicePage } from './pages/Services/RequestServicePage';
import { ServiceEditPage } from './pages/Services/ServiceEditPage';
import { ServicePage } from './pages/Services/ServicePage';
import { ServiceRequestPage } from './pages/Services/ServiceRequestPage';
import { ServiceRequestsListPage } from './pages/Services/ServiceRequestsListPage';
import { ServicesListPage } from './pages/Services/ServicesListPage';
import { WardBedsPage } from './pages/Ward/WardBedsPage';
import { WardEditPage } from './pages/Ward/WardEditPage';
import { WardPage } from './pages/Ward/WardPage';
import { WardsListPage } from './pages/Ward/WardsListPage';
import './styles/App.css';
import { Models } from './types/models';
import { ContactsListPage } from './pages/ContactList/ContactsListPage';
import { ContactEditPage } from './pages/ContactList/ContactEditPage';
import { ContactPage } from './pages/ContactList/ContactPage';
import { InstitutionBuilderPage } from './pages/Config/InstitutionBuilderPage';
import { EmployeeEditPage } from './pages/UserManagement/EmployeeEditPage';
import { EmployeePage } from './pages/UserManagement/EmployeePage';
import { EmployeesListPage } from './pages/UserManagement/EmployeesListPage';
import { RoleEditPage } from './pages/UserManagement/RoleEditPage';
import { RolePage } from './pages/UserManagement/RolePage';
import { RolesListPage } from './pages/UserManagement/RolesListPage';

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
            exact path="/config/institution"
            render={props => <InstitutionBuilderPage {...props} />}
          />

          <Route 
            exact path="/patients"
            render={props => <PatientsListPage {...props} />}
          />
          <Route 
            exact path="/create/patient"
            render={props => <CreatePatientPage {...props} />}
          />
          <Route 
            exact path="/mypatients"
            render={props => <MyPatientsPage {...props} />}
          />
          <Route 
            exact path="/patients/:patientId"
            render={props => <PatientPage {...props} />}
          />
          <Route 
            exact path="/patients/:patientId/medications"
            render={props => <PatientMedicationsPage {...props} />}
          />
          <Route 
            exact path="/patients/:patientId/diagnostics"
            render={props => <PatientDiagnosticsPage {...props} />}
          />
          <Route 
            exact path="/patients/:patientId/observations"
            render={props => <PatientObservationsPage {...props} />}
          />
          <Route 
            exact path="/patients/:patientId/equipment"
            render={props => <PatientEquipmentPage {...props} />}
          />
          <Route 
            exact path="/patients/:patientId/documents"
            render={props => <PatientDocumentsPage {...props} />}
          />
          <Route 
            exact path="/patients/:patientId/timeline"
            render={props => <PatientTimelinePage {...props} />}
          />
          <Route 
            exact path="/patients/:patientId/notes"
            render={props => <PatientNotesPage {...props} />}
          />

          <Route 
            exact path="/wards"
            render={props => <WardsListPage {...props} />}
          />
          <Route 
            exact path="/create/ward"
            render={props => <WardEditPage {...props} />}
          />
          <Route 
            exact path="/wards/:wardId"
            render={props => <WardPage {...props} />}
          />
          <Route 
            exact path="/wards/:wardId/edit"
            render={props => <WardEditPage {...props} />}
          />
          <Route 
            exact path="/wards/:wardId/beds"
            render={props => <WardBedsPage {...props} />}
          />

          <Route 
            exact path="/services"
            render={props => <ServicesListPage {...props} />}
          />
          <Route 
            exact path="/create/service"
            render={props => <ServiceEditPage {...props} />}
          />
          <Route 
            exact path="/services/:serviceId"
            render={props => <ServicePage {...props} />}
          />
          <Route 
            exact path="/services/:serviceId/edit"
            render={props => <ServiceEditPage {...props} />}
          />
          <Route 
            exact path="/services/:serviceId/request"
            render={props => <RequestServicePage {...props} />}
          />
          <Route 
            exact path="/services/:serviceId/requests"
            render={props => <ServiceRequestsListPage {...props} />}
          />
          <Route 
            exact path="/servicerequests/:requestId"
            render={props => <ServiceRequestPage {...props} />}
          />

          <Route 
            exact path="/departments"
            render={props => <DepartmentsListPage {...props} />}
          />
          <Route 
            exact path="/create/department"
            render={props => <DepartmentEditPage {...props} />}
          />
          <Route 
            exact path="/departments/:departmentId"
            render={props => <DepartmentPage {...props} />}
          />
          <Route 
            exact path="/departments/:departmentId/edit"
            render={props => <DepartmentEditPage {...props} />}
          />
          <Route 
            exact path="/departments/:departmentId/services"
            render={props => <ServicesListPage {...props} />}
          />
          <Route 
            exact path="/departments/:departmentId/resources"
            render={props => <ResourcesListPage {...props} />}
          />
          <Route 
            exact path="/departments/:departmentId/stocks"
            render={props => <StocksListPage {...props} />}
          />
          
          <Route 
            exact path="/resources"
            render={props => <ResourcesListPage {...props} />}
          />
          <Route 
            exact path="/create/resource"
            render={props => <ResourceEditPage {...props} />}
          />
          <Route 
            exact path="/resources/:resourceId"
            render={props => <ResourcePage {...props} />}
          />
          <Route 
            exact path="/resources/:resourceId/edit"
            render={props => <ResourceEditPage {...props} />}
          />
          <Route 
            exact path="/consumables"
            render={props => <ConsumablesListPage {...props} />}
          />
          <Route 
            exact path="/create/consumable"
            render={props => <ConsumableEditPage {...props} />}
          />
          <Route 
            exact path="/consumables/:consumableId"
            render={props => <ConsumablePage {...props} />}
          />
          <Route 
            exact path="/consumables/:consumableId/edit"
            render={props => <ConsumableEditPage {...props} />}
          />
          <Route 
            exact path="/stocks"
            render={props => <StocksListPage {...props} />}
          />
          <Route 
            exact path="/create/stock"
            render={props => <ConsumableEditPage {...props} />}
          />
          <Route 
            exact path="/stocks/:stockId"
            render={props => <StockPage {...props} />}
          />
          <Route 
            exact path="/stocks/:stockId/edit"
            render={props => <StockEditPage {...props} />}
          />
          
          <Route 
            exact path="/employees"
            render={props => <EmployeesListPage {...props} />}
          />
          <Route 
            exact path="/create/employee"
            render={props => <EmployeeEditPage {...props} />}
          />
          <Route 
            exact path="/employees/:employeeId"
            render={props => <EmployeePage {...props} />}
          />
          <Route 
            exact path="/employees/:employeeId/edit"
            render={props => <EmployeeEditPage {...props} />}
          />
          
          <Route 
            exact path="/roles"
            render={props => <RolesListPage {...props} />}
          />
          <Route 
            exact path="/create/role"
            render={props => <RoleEditPage {...props} />}
          />
          <Route 
            exact path="/roles/:roleId"
            render={props => <RolePage {...props} />}
          />
          <Route 
            exact path="/roles/:roleId/edit"
            render={props => <RoleEditPage {...props} />}
          />
          
          <Route 
            exact path="/contacts"
            render={props => <ContactsListPage {...props} />}
          />
          <Route 
            exact path="/create/contact"
            render={props => <ContactEditPage {...props} />}
          />
          <Route 
            exact path="/contacts/:contactId"
            render={props => <ContactPage {...props} />}
          />
          <Route 
            exact path="/contacts/:contactId/edit"
            render={props => <ContactEditPage {...props} />}
          />
        </Switch>
      </Layout>
    </UserContext.Provider>
  );
}

export default App;
