import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import UserContext from './localComponents/contexts/UserContext';
import { AccountsPage } from './localComponents/pages/UserManagement/AccountsPage';
import { AdminHomePage } from './localComponents/pages/Admin/AdminHomePage';
import { CreateEditStudyPage } from './localComponents/pages/Researcher/CreateEditStudyPage';
import { LoginPage } from './localComponents/pages/LoginPage';
import { PatientsListPage } from './localComponents/pages/HealthProfessional/PatientsListPage';
import { RegisterAccountPage } from './localComponents/pages/UserManagement/RegisterAccountPage';
import { ResearcherHomePage } from './localComponents/pages/Researcher/ResearcherHomePage';
import { SharerHomePage } from './localComponents/pages/Sharer/SharerHomePage';
import { AccountType } from './localComponents/types/enums.d';
import { ViewModels } from './localComponents/types/viewModels';
import { ApiClient, apiClient } from './sharedCommonComponents/communication/ApiClient';
import './localComponents/styles/App.css';
import { defaultGlobalizer, Globalizer } from './sharedCommonComponents/helpers/Globalizer';
import germanTranslation from './localComponents/resources/translation.de.json';
import englishTranslation from './localComponents/resources/translation.en.json';
import { NotFoundPage } from './localComponents/pages/NotFoundPage';
import { CreatePatientDocumentPage } from './sharedHealthComponents/pages/Patients/CreatePatientDocumentPage';
import { CreatePatientNotePage } from './sharedHealthComponents/pages/Patients/CreatePatientNotePage';
import { CreatePatientObservationPage } from './sharedHealthComponents/pages/Patients/CreatePatientObservationPage';
import { CreatePatientTestResultPage } from './sharedHealthComponents/pages/Patients/CreatePatientTestResultPage';
import { EditMedicationSchedulePage } from './sharedHealthComponents/pages/Patients/EditMedicationSchedulePage';
import { PatientMedicationsPage } from './sharedHealthComponents/pages/Patients/PatientMedicationsPage';
import { PatientTimelinePage } from './sharedHealthComponents/pages/Patients/PatientTimelinePage';
import { AccountEditPage } from './localComponents/pages/UserManagement/AccountEditPage';
import { HealthProfessionalHomePage } from './localComponents/pages/HealthProfessional/HealthProfessionalHomePage';
import { HomePage } from './localComponents/pages/HomePage';
import { StudiesPage } from './localComponents/pages/Researcher/StudiesPage';
import { StudyPage } from './localComponents/pages/Researcher/StudyPage';
import { GenomeUploadPage } from './localComponents/pages/Sharer/GenomeUploadPage';
import { GiveHealthProfesionalAccessPage } from './localComponents/pages/Sharer/GiveHealthProfesionalAccessPage';
import { HealthRecordPage } from './localComponents/pages/Sharer/HealthRecordPage';
import { ImagingUploadPage } from './localComponents/pages/Sharer/ImagingUploadPage';
import { ReceiveHealthProfessionalAccessPage } from './localComponents/pages/HealthProfessional/ReceiveHealthProfessionalAccessPage';

const accessTokenSessionStorageKey = "accessToken";
const userSessionStorageKey = "loggedInUser";
defaultGlobalizer.instance = new Globalizer("de", "en", [ germanTranslation, englishTranslation ]);
apiClient.instance = window.location.hostname.toLowerCase() === "localhost"
    ? new ApiClient(window.location.hostname, 44303)
    : new ApiClient(window.location.hostname, 443);
if(!!sessionStorage.getItem(accessTokenSessionStorageKey)) {
    apiClient.instance!.setAccessToken(sessionStorage.getItem(accessTokenSessionStorageKey)!);
}

function App() {

    const [loggedInUser, setLoggedInUser] = useState<ViewModels.LoggedInUserViewModel | undefined>(
        !!sessionStorage.getItem(userSessionStorageKey) 
            ? JSON.parse(sessionStorage.getItem(userSessionStorageKey)!)
            : undefined
        );
    const navigate = useNavigate();
    const onLoggedIn = (userViewModel: ViewModels.LoggedInUserViewModel) => {
        if (userViewModel.authenticationResult.isAuthenticated) {
            apiClient.instance!.setAccessToken(userViewModel.authenticationResult.accessToken!);
            sessionStorage.setItem(accessTokenSessionStorageKey, userViewModel.authenticationResult.accessToken!);
            sessionStorage.setItem(userSessionStorageKey, JSON.stringify(userViewModel));
            setLoggedInUser(userViewModel);
            navigate("/");
        }
    }
    const onLogOut = () => {
        setLoggedInUser(undefined);
        sessionStorage.removeItem(accessTokenSessionStorageKey);
        sessionStorage.removeItem(userSessionStorageKey);
        navigate("/");
    }

    if (!loggedInUser) {
        return (
            <Container>
                <Row>
                    <Col>
                        <Routes>
                            <Route path="/login/:role" element={<LoginPage onLoggedIn={onLoggedIn} />} />
                            <Route path="/register/:role" element={<RegisterAccountPage />} />
                            <Route path="/" element={<HomePage />} />
                        </Routes>
                    </Col>
                </Row>
            </Container>
        );
    }

    let userTypeHomePage = (<HomePage />);
    switch(loggedInUser.accountType) {
        case AccountType.Admin:
            userTypeHomePage = (<AdminHomePage />);
            break;
        case AccountType.HealthProfessional:
            userTypeHomePage = (<HealthProfessionalHomePage />);
            break;
        case AccountType.Researcher:
            userTypeHomePage = (<ResearcherHomePage />);
            break;
        case AccountType.Sharer:
            userTypeHomePage = (<SharerHomePage />);
            break;
    }

    return (
        <UserContext.Provider value={loggedInUser}>
            <Layout onLogOut={onLogOut}>
                <Routes>
                    <Route path="/create/study" element={<CreateEditStudyPage />} />
                    <Route path="/edit/study/:id" element={<CreateEditStudyPage />} />
                    <Route path="/study/:id" element={<StudyPage />} />
                    <Route path="/studies" element={<StudiesPage />} />
                    <Route path="/giveaccess/healthprofessional" element={<GiveHealthProfesionalAccessPage />} />
                    <Route path="/accessrequests/:requestId" element={<ReceiveHealthProfessionalAccessPage />} />

                    <Route path="/accounts" element={<AccountsPage />} />
                    <Route path="/create/account" element={<AccountEditPage />} />
                    <Route path="/accounts/:username/edit" element={<AccountEditPage />} />

                    <Route path="/patients" element={<PatientsListPage />} />

                    <Route path="/healthrecord/:personId" element={<HealthRecordPage />} />
                    <Route path="/healthrecord/:personId/timeline" element={<PatientTimelinePage />} />
                    <Route path="/healthrecord/:personId/medications" element={<PatientMedicationsPage />} />
                    <Route path="/healthrecord/:personId/create/testresult" element={<CreatePatientTestResultPage />} />
                    <Route path="/healthrecord/:personId/create/observation" element={<CreatePatientObservationPage />} />
                    <Route path="/healthrecord/:personId/create/document" element={<CreatePatientDocumentPage />} />
                    <Route path="/healthrecord/:personId/create/note" element={<CreatePatientNotePage />} />
                    <Route path="/medicationschedules/:scheduleId/edit" element={<EditMedicationSchedulePage />} />
                    <Route path="/healthrecord/upload/imaging" element={<ImagingUploadPage />} />
                    <Route path="/healthrecord/upload/genome" element={<GenomeUploadPage />} />

                    <Route path="/" element={userTypeHomePage} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Layout>
        </UserContext.Provider>
    );
}

export default App;
 