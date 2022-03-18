import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import UserContext from './localComponents/contexts/UserContext';
import { AccountsPage } from './localComponents/pages/AccountsPage';
import { AdminHomePage } from './localComponents/pages/AdminHomePage';
import { CreateEditStudyPage } from './localComponents/pages/CreateEditStudyPage';
import { GenomeUploadPage } from './localComponents/pages/GenomeUploadPage';
import { GiveHealthProfesionalAccessPage } from './localComponents/pages/GiveHealthProfesionalAccessPage';
import { HealthDataOverviewPage } from './localComponents/pages/HealthDataOverviewPage';
import { HealthProfessionalHomePage } from './localComponents/pages/HealthProfessionalHomePage';
import { HomePage } from './localComponents/pages/HomePage';
import { ImagingUploadPage } from './localComponents/pages/ImagingUploadPage';
import { LoginPage } from './localComponents/pages/LoginPage';
import { PatientPage } from './localComponents/pages/PatientPage';
import { PatientsListPage } from './localComponents/pages/PatientsListPage';
import { RegisterAccountPage } from './localComponents/pages/RegisterAccountPage';
import { ResearcherHomePage } from './localComponents/pages/ResearcherHomePage';
import { SharerHomePage } from './localComponents/pages/SharerHomePage';
import { StudiesPage } from './localComponents/pages/StudiesPage';
import { StudyPage } from './localComponents/pages/StudyPage';
import { AccountType } from './localComponents/types/enums.d';
import { ViewModels } from './localComponents/types/viewModels';
import { ApiClient, apiClient } from './sharedCommonComponents/communication/ApiClient';
import './localComponents/styles/App.css';
import { defaultGlobalizer, Globalizer } from './sharedCommonComponents/helpers/Globalizer';
import germanTranslation from './localComponents/resources/translation.de.json';
import englishTranslation from './localComponents/resources/translation.en.json';

defaultGlobalizer.instance = new Globalizer("de", "en", [ germanTranslation, englishTranslation ]);
apiClient.instance = window.location.hostname.toLowerCase() === "localhost"
    ? new ApiClient(window.location.hostname, 44303)
    : new ApiClient(window.location.hostname, 443);

function App() {

    const [loggedInUser, setLoggedInUser] = useState<ViewModels.LoggedInUserViewModel>();
    const navigate = useNavigate();
    const onLoggedIn = (userViewModel: ViewModels.LoggedInUserViewModel) => {
        if (userViewModel.authenticationResult.isAuthenticated) {
            apiClient.instance!.setAccessToken(userViewModel.authenticationResult.accessToken!);
            setLoggedInUser(userViewModel);
            navigate("/");
        }
    }
    const onLogOut = () => {
        setLoggedInUser(undefined);
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
                    <Route path="/sharer" element={<HealthDataOverviewPage />} />
                    <Route path="/sharer/upload/imaging" element={<ImagingUploadPage />} />
                    <Route path="/sharer/upload/genome" element={<GenomeUploadPage />} />
                    <Route path="/accounts" element={<AccountsPage />} />
                    <Route path="/patients" element={<PatientsListPage />} />
                    <Route path="/patient/:patientId" element={<PatientPage />} />
                    <Route path="/giveaccess/healthprofessional" element={<GiveHealthProfesionalAccessPage />} />
                    <Route path="/" element={userTypeHomePage} />
                    <Route path="*" element={userTypeHomePage} />
                </Routes>
            </Layout>
        </UserContext.Provider>
    );
}

export default App;
 