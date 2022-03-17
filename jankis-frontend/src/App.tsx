import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './localComponents/components/Layout';
import UserContext from './localComponents/contexts/UserContext';
import { InstitutionEditPage } from './localComponents/pages/Config/InstitutionEditPage';
import { InstitutionsListPage } from './localComponents/pages/Config/InstitutionsListPage';
import { ConsumableEditPage } from './localComponents/pages/Consumables/ConsumableEditPage';
import { ConsumablePage } from './localComponents/pages/Consumables/ConsumablePage';
import { ConsumablesListPage } from './localComponents/pages/Consumables/ConsumablesListPage';
import { ContactEditPage } from './localComponents/pages/ContactList/ContactEditPage';
import { ContactPage } from './localComponents/pages/ContactList/ContactPage';
import { ContactsListPage } from './localComponents/pages/ContactList/ContactsListPage';
import { BedOccupancyEditPage } from './localComponents/pages/Departments/BedOccupancyEditPage';
import { DepartmentEditPage } from './localComponents/pages/Departments/DepartmentEditPage';
import { DepartmentPage } from './localComponents/pages/Departments/DepartmentPage';
import { DepartmentsListPage } from './localComponents/pages/Departments/DepartmentsListPage';
import { RoomsPage } from './localComponents/pages/Departments/RoomsPage';
import { CreateEditDrugPage } from './localComponents/pages/Drugs/CreateEditDrugPage';
import { DrugsListPage } from './localComponents/pages/Drugs/DrugsListPage';
import { LoginPage } from './localComponents/pages/LoginPage';
import { NewsPage } from './localComponents/pages/NewsPage';
import { AdmissionsListPage } from './localComponents/pages/Patients/AdmissionsListPage';
import { CreateEditPatientPage } from './localComponents/pages/Patients/CreateEditPatientPage';
import { CreatePatientDocumentPage } from './localComponents/pages/Patients/CreatePatientDocumentPage';
import { CreatePatientNotePage } from './localComponents/pages/Patients/CreatePatientNotePage';
import { CreatePatientObservationPage } from './localComponents/pages/Patients/CreatePatientObservationPage';
import { CreatePatientTestResultPage } from './localComponents/pages/Patients/CreatePatientTestResultPage';
import { EditMedicationSchedulePage } from './localComponents/pages/Patients/EditMedicationSchedulePage';
import { MyPatientsPage } from './localComponents/pages/Patients/MyPatientsPage';
import { OrderServiceForPatientPage } from './localComponents/pages/Patients/OrderServiceForPatientPage';
import { PatientEquipmentPage } from './localComponents/pages/Patients/PatientEquipmentPage';
import { PatientMedicationsPage } from './localComponents/pages/Patients/PatientMedicationsPage';
import { PatientNursingPage } from './localComponents/pages/Patients/PatientNursingPage';
import { PatientPage } from './localComponents/pages/Patients/PatientPage';
import { PatientTimelinePage } from './localComponents/pages/Patients/PatientTimelinePage';
import { PersonsListPage } from './localComponents/pages/Patients/PersonsListPage';
import { ResourceEditPage } from './localComponents/pages/Resources/ResourceEditPage';
import { ResourcePage } from './localComponents/pages/Resources/ResourcePage';
import { ResourcesListPage } from './localComponents/pages/Resources/ResourcesListPage';
import { RequestServicePage } from './localComponents/pages/Services/RequestServicePage';
import { ServiceEditPage } from './localComponents/pages/Services/ServiceEditPage';
import { ServicePage } from './localComponents/pages/Services/ServicePage';
import { ServiceRequestPage } from './localComponents/pages/Services/ServiceRequestPage';
import { ServiceRequestsListPage } from './localComponents/pages/Services/ServiceRequestsListPage';
import { ServicesListPage } from './localComponents/pages/Services/ServicesListPage';
import { StockEditPage } from './localComponents/pages/Stocks/StockEditPage';
import { StockPage } from './localComponents/pages/Stocks/StockPage';
import { StocksListPage } from './localComponents/pages/Stocks/StocksListPage';
import { AccountEditPage } from './localComponents/pages/UserManagement/AccountEditPage';
import { AccountsListPage } from './localComponents/pages/UserManagement/AccountsListPage';
import { RoleEditPage } from './localComponents/pages/UserManagement/RoleEditPage';
import { RolePage } from './localComponents/pages/UserManagement/RolePage';
import { RolesListPage } from './localComponents/pages/UserManagement/RolesListPage';
import { ViewModels } from './localComponents/types/viewModels';
import { ApiClient, apiClient } from './sharedCommonComponents/communication/ApiClient';
import { defaultGlobalizer, Globalizer } from './sharedCommonComponents/helpers/Globalizer';
import germanTranslation from './localComponents/resources/translation.de.json';
import danishTranslation from './localComponents/resources/translation.dk.json';
import englishTranslation from './localComponents/resources/translation.en.json';

defaultGlobalizer.instance = new Globalizer("de", "en", [ germanTranslation, danishTranslation, englishTranslation ]);
apiClient.instance = window.location.hostname.toLowerCase() === "localhost"
    ? new ApiClient(window.location.hostname, 44301)
    : new ApiClient(window.location.hostname, 443);

function App() {

    const [loggedInUser, setLoggedInUser] = useState<ViewModels.LoggedInUserViewModel>();
    const onLoggedIn = (userViewModel: ViewModels.LoggedInUserViewModel) => {
        if (userViewModel.authenticationResult.isAuthenticated) {
            apiClient.instance!.setAccessToken(userViewModel.authenticationResult.accessToken!);
            setLoggedInUser(userViewModel);
        }
    }

    if (!loggedInUser) {
        return (<LoginPage onLoggedIn={onLoggedIn} />)
    }

    return (
        <UserContext.Provider value={loggedInUser}>
            <Layout onLogOut={() => setLoggedInUser(undefined)}>
                <Routes>
                    <Route 
                        path="/"
                        element={<NewsPage />}
                    />

                    <Route
                        path="/admissions"
                        element={<AdmissionsListPage />}
                    />
                    <Route
                        path="/create/(patient|person)"
                        element={<CreateEditPatientPage />}
                    />
                    <Route
                        path="/(patients|persons)/:patientId/edit"
                        element={<CreateEditPatientPage />}
                    />
                    <Route
                        path="/mypatients"
                        element={<MyPatientsPage />}
                    />
                    <Route
                        path="/persons"
                        element={<PersonsListPage filter={{}} />}
                    />
                    <Route
                        path="/patients/:patientId"
                        element={<PatientPage />}
                    />
                    <Route
                        path="/patients/:patientId/nursing"
                        element={<PatientNursingPage />}
                    />
                    <Route
                        path="/patients/:patientId/timeline"
                        element={<PatientTimelinePage />}
                    />
                    <Route
                        path="/patients/:patientId/medications"
                        element={<PatientMedicationsPage />}
                    />
                    <Route
                        path="/patients/:patientId/create/testresult"
                        element={<CreatePatientTestResultPage />}
                    />
                    <Route
                        path="/patients/:patientId/create/observation"
                        element={<CreatePatientObservationPage />}
                    />
                    <Route
                        path="/patients/:patientId/create/document"
                        element={<CreatePatientDocumentPage />}
                    />
                    <Route
                        path="/patients/:patientId/create/note"
                        element={<CreatePatientNotePage />}
                    />
                    <Route
                        path="/patients/:patientId/equipment"
                        element={<PatientEquipmentPage />}
                    />
                    <Route
                        path="/patients/:patientId/order/service"
                        element={<OrderServiceForPatientPage />}
                    />
                    <Route
                        path="/medicationschedules/:scheduleId/edit"
                        element={<EditMedicationSchedulePage />}
                    />

                    <Route
                        path="/services"
                        element={<ServicesListPage />}
                    />
                    <Route
                        path="/create/service"
                        element={<ServiceEditPage />}
                    />
                    <Route
                        path="/services/:serviceId"
                        element={<ServicePage />}
                    />
                    <Route
                        path="/services/:serviceId/edit"
                        element={<ServiceEditPage />}
                    />
                    <Route
                        path="/services/:serviceId/request"
                        element={<RequestServicePage />}
                    />
                    <Route
                        path="/services/:serviceId/requests"
                        element={<ServiceRequestsListPage />}
                    />
                    <Route
                        path="/servicerequests"
                        element={<ServiceRequestsListPage />}
                    />
                    <Route
                        path="/servicerequests/:requestId"
                        element={<ServiceRequestPage />}
                    />
                    <Route
                        path="/create/servicerequest"
                        element={<RequestServicePage />}
                    />

                    <Route
                        path="/departments"
                        element={<DepartmentsListPage />}
                    />
                    <Route
                        path="/create/department"
                        element={<DepartmentEditPage />}
                    />
                    <Route
                        path="/departments/:departmentId"
                        element={<DepartmentPage />}
                    />
                    <Route
                        path="/departments/:departmentId/edit"
                        element={<DepartmentEditPage />}
                    />
                    <Route
                        path="/departments/:departmentId/services"
                        element={<ServicesListPage />}
                    />
                    <Route
                        path="/departments/:departmentId/requests"
                        element={<ServiceRequestsListPage />}
                    />
                    <Route
                        path="/departments/:departmentId/resources"
                        element={<ResourcesListPage />}
                    />
                    <Route
                        path="/departments/:departmentId/stocks"
                        element={<StocksListPage />}
                    />

                    <Route
                        path="/resources"
                        element={<ResourcesListPage />}
                    />
                    <Route
                        path="/create/resource"
                        element={<ResourceEditPage />}
                    />
                    <Route
                        path="/resources/:resourceId"
                        element={<ResourcePage />}
                    />
                    <Route
                        path="/resources/:resourceId/edit"
                        element={<ResourceEditPage />}
                    />
                    <Route
                        path="/consumables"
                        element={<ConsumablesListPage />}
                    />
                    <Route
                        path="/create/consumable"
                        element={<ConsumableEditPage />}
                    />
                    <Route
                        path="/consumables/:consumableId"
                        element={<ConsumablePage />}
                    />
                    <Route
                        path="/consumables/:consumableId/edit"
                        element={<ConsumableEditPage />}
                    />
                    <Route
                        path="/stocks"
                        element={<StocksListPage />}
                    />
                    <Route
                        path="/create/stock"
                        element={<StockEditPage />}
                    />
                    <Route
                        path="/stocks/:stockId"
                        element={<StockPage />}
                    />
                    <Route
                        path="/stocks/:stockId/edit"
                        element={<StockEditPage />}
                    />
                    <Route
                        path="/drugs"
                        element={<DrugsListPage />}
                    />
                    <Route
                        path="/drugs/:drugId/edit"
                        element={<CreateEditDrugPage />}
                    />
                    <Route
                        path="/create/drug"
                        element={<CreateEditDrugPage />}
                    />

                    <Route
                        path="/accounts"
                        element={<AccountsListPage />}
                    />
                    <Route
                        path="/create/account"
                        element={<AccountEditPage />}
                    />
                    <Route
                        path="/accounts/:username/edit"
                        element={<AccountEditPage />}
                    />

                    <Route
                        path="/roles"
                        element={<RolesListPage />}
                    />
                    <Route
                        path="/create/role"
                        element={<RoleEditPage />}
                    />
                    <Route
                        path="/roles/:roleId"
                        element={<RolePage />}
                    />
                    <Route
                        path="/roles/:roleId/edit"
                        element={<RoleEditPage />}
                    />

                    <Route
                        path="/contacts"
                        element={<ContactsListPage />}
                    />
                    <Route
                        path="/create/contact"
                        element={<ContactEditPage />}
                    />
                    <Route
                        path="/contacts/:contactId"
                        element={<ContactPage />}
                    />
                    <Route
                        path="/contacts/:contactId/edit"
                        element={<ContactEditPage />}
                    />

                    <Route
                        path="/institutions"
                        element={<InstitutionsListPage />}
                    />
                    <Route
                        path="/institutions/:institutionId/edit"
                        element={<InstitutionEditPage />}
                    />
                    <Route
                        path="/create/institution"
                        element={<InstitutionEditPage />}
                    />

                    <Route
                        path="/rooms"
                        element={<RoomsPage />}
                    />
                    <Route
                        path="/create/bedoccupancy/department/:departmentId/room/:roomId/bed/:bedPosition"
                        element={<BedOccupancyEditPage />}
                    />
                    <Route
                        path="/bedoccupancies/:occupancyId/edit"
                        element={<BedOccupancyEditPage />}
                    />
                </Routes>
            </Layout>
        </UserContext.Provider>
    );
}

export default App;
