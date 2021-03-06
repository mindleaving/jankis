import React, { useState } from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import UserContext from './contexts/UserContext';
import { DepartmentEditPage } from './pages/Departments/DepartmentEditPage';
import { DepartmentPage } from './pages/Departments/DepartmentPage';
import { DepartmentsListPage } from './pages/Departments/DepartmentsListPage';
import { NewsPage } from './pages/NewsPage';
import { CreateEditPatientPage } from './pages/Patients/CreateEditPatientPage';
import { MyPatientsPage } from './pages/Patients/MyPatientsPage';
import { CreatePatientTestResultPage } from './pages/Patients/CreatePatientTestResultPage';
import { CreatePatientDocumentPage } from './pages/Patients/CreatePatientDocumentPage';
import { PatientEquipmentPage } from './pages/Patients/PatientEquipmentPage';
import { PatientMedicationsPage } from './pages/Patients/PatientMedicationsPage';
import { CreatePatientNotePage } from './pages/Patients/CreatePatientNotePage';
import { CreatePatientObservationPage } from './pages/Patients/CreatePatientObservationPage';
import { PatientTimelinePage } from './pages/Patients/PatientTimelinePage';
import { ConsumablePage } from './pages/Consumables/ConsumablePage';
import { ConsumablesListPage } from './pages/Consumables/ConsumablesListPage';
import { ResourceEditPage } from './pages/Resources/ResourceEditPage';
import { ResourcePage } from './pages/Resources/ResourcePage';
import { ResourcesListPage } from './pages/Resources/ResourcesListPage';
import { StockEditPage } from './pages/Stocks/StockEditPage';
import { StockPage } from './pages/Stocks/StockPage';
import { StocksListPage } from './pages/Stocks/StocksListPage';
import { RequestServicePage } from './pages/Services/RequestServicePage';
import { ServiceEditPage } from './pages/Services/ServiceEditPage';
import { ServicePage } from './pages/Services/ServicePage';
import { ServiceRequestPage } from './pages/Services/ServiceRequestPage';
import { ServiceRequestsListPage } from './pages/Services/ServiceRequestsListPage';
import { ServicesListPage } from './pages/Services/ServicesListPage';
import { ContactsListPage } from './pages/ContactList/ContactsListPage';
import { ContactEditPage } from './pages/ContactList/ContactEditPage';
import { ContactPage } from './pages/ContactList/ContactPage';
import { InstitutionEditPage } from './pages/Config/InstitutionEditPage';
import { AccountEditPage } from './pages/UserManagement/AccountEditPage';
import { AccountsListPage } from './pages/UserManagement/AccountsListPage';
import { RoleEditPage } from './pages/UserManagement/RoleEditPage';
import { RolePage } from './pages/UserManagement/RolePage';
import { RolesListPage } from './pages/UserManagement/RolesListPage';
import { LoginPage } from './pages/LoginPage';
import { apiClient } from './communication/ApiClient';
import { ViewModels } from './types/viewModels';
import { AdmissionsListPage } from './pages/Patients/AdmissionsListPage';
import { InstitutionsListPage } from './pages/Config/InstitutionsListPage';
import { PatientPage } from './pages/Patients/PatientPage';
import { RoomsPage } from './pages/Departments/RoomsPage';
import { BedOccupancyEditPage } from './pages/Departments/BedOccupancyEditPage';
import { OrderServiceForPatientPage } from './pages/Patients/OrderServiceForPatientPage';
import { PersonsListPage } from './pages/Patients/PersonsListPage';
import { DrugsListPage } from './pages/Drugs/DrugsListPage';
import { CreateEditDrugPage } from './pages/Drugs/CreateEditDrugPage';
import { EditMedicationSchedulePage } from './pages/Patients/EditMedicationSchedulePage';
import { ConsumableEditPage } from './pages/Consumables/ConsumableEditPage';
import { PatientNursingPage } from './pages/Patients/PatientNursingPage';

function App() {

    const [loggedInUser, setLoggedInUser] = useState<ViewModels.LoggedInUserViewModel>();
    const onLoggedIn = (userViewModel: ViewModels.LoggedInUserViewModel) => {
        if (userViewModel.authenticationResult.isAuthenticated) {
            apiClient.setAccessToken(userViewModel.authenticationResult.accessToken!);
            setLoggedInUser(userViewModel);
        }
    }

    if (!loggedInUser) {
        return (<LoginPage onLoggedIn={onLoggedIn} />)
    }

    return (
        <UserContext.Provider value={loggedInUser}>
            <Layout onLogOut={() => setLoggedInUser(undefined)}>
                <Switch>
                    <Route exact path="/">
                        <NewsPage />
                    </Route>

                    <Route
                        exact path="/admissions"
                        render={props => <AdmissionsListPage {...props} />}
                    />
                    <Route
                        exact path="/create/(patient|person)"
                        render={props => <CreateEditPatientPage {...props} />}
                    />
                    <Route
                        exact path="/(patients|persons)/:patientId/edit"
                        render={props => <CreateEditPatientPage {...props} />}
                    />
                    <Route
                        exact path="/mypatients"
                        render={props => <MyPatientsPage {...props} />}
                    />
                    <Route
                        exact path="/persons"
                        render={props => <PersonsListPage filter={{}} {...props} />}
                    />
                    <Route
                        exact path="/patients/:patientId"
                        render={props => <PatientPage {...props} />}
                    />
                    <Route
                        exact path="/patients/:patientId/nursing"
                        render={props => <PatientNursingPage {...props} />}
                    />
                    <Route
                        exact path="/patients/:patientId/timeline"
                        render={props => <PatientTimelinePage {...props} />}
                    />
                    <Route
                        exact path="/patients/:patientId/medications"
                        render={props => <PatientMedicationsPage {...props} />}
                    />
                    <Route
                        exact path="/patients/:patientId/create/testresult"
                        render={props => <CreatePatientTestResultPage {...props} />}
                    />
                    <Route
                        exact path="/patients/:patientId/create/observation"
                        render={props => <CreatePatientObservationPage {...props} />}
                    />
                    <Route
                        exact path="/patients/:patientId/create/document"
                        render={props => <CreatePatientDocumentPage {...props} />}
                    />
                    <Route
                        exact path="/patients/:patientId/create/note"
                        render={props => <CreatePatientNotePage {...props} />}
                    />
                    <Route
                        exact path="/patients/:patientId/equipment"
                        render={props => <PatientEquipmentPage {...props} />}
                    />
                    <Route
                        exact path="/patients/:patientId/order/service"
                        render={props => <OrderServiceForPatientPage {...props} />}
                    />
                    <Route
                        exact path="/medicationschedules/:scheduleId/edit"
                        render={props => <EditMedicationSchedulePage {...props} />}
                    />

                    <Route
                        exact path="/services"
                        render={props => <ServicesListPage />}
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
                        render={props => <ServiceRequestsListPage filter={{ serviceId: props.match.params.serviceId }} />}
                    />
                    <Route
                        exact path="/servicerequests"
                        render={props => <ServiceRequestsListPage />}
                    />
                    <Route
                        exact path="/servicerequests/:requestId"
                        render={props => <ServiceRequestPage {...props} />}
                    />
                    <Route
                        exact path="/create/servicerequest"
                        render={props => <RequestServicePage {...props} />}
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
                        render={props => <ServicesListPage filter={{ departmentId: props.match.params.departmentId }} />}
                    />
                    <Route
                        exact path="/departments/:departmentId/requests"
                        render={props => <ServiceRequestsListPage filter={{ departmentId: props.match.params.departmentId }} />}
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
                        render={props => <StockEditPage {...props} />}
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
                        exact path="/drugs"
                        render={props => <DrugsListPage {...props} />}
                    />
                    <Route
                        exact path="/drugs/:drugId/edit"
                        render={props => <CreateEditDrugPage {...props} />}
                    />
                    <Route
                        exact path="/create/drug"
                        render={props => <CreateEditDrugPage {...props} />}
                    />

                    <Route
                        exact path="/accounts"
                        render={props => <AccountsListPage {...props} />}
                    />
                    <Route
                        exact path="/create/account"
                        render={props => <AccountEditPage {...props} />}
                    />
                    <Route
                        exact path="/accounts/:username/edit"
                        render={props => <AccountEditPage {...props} />}
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

                    <Route
                        exact path="/institutions"
                        render={props => <InstitutionsListPage {...props} />}
                    />
                    <Route
                        exact path="/institutions/:institutionId/edit"
                        render={props => <InstitutionEditPage {...props} />}
                    />
                    <Route
                        exact path="/create/institution"
                        render={props => <InstitutionEditPage {...props} />}
                    />

                    <Route
                        exact path="/rooms"
                        render={props => <RoomsPage {...props} />}
                    />
                    <Route
                        exact path="/create/bedoccupancy/department/:departmentId/room/:roomId/bed/:bedPosition"
                        render={props => <BedOccupancyEditPage {...props} />}
                    />
                    <Route
                        exact path="/bedoccupancies/:occupancyId/edit"
                        render={props => <BedOccupancyEditPage {...props} />}
                    />
                </Switch>
            </Layout>
        </UserContext.Provider>
    );
}

export default App;
