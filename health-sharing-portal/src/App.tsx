import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { apiClient } from './communication/ApiClient';
import UserContext from './contexts/UserContext';
import { Layout } from './Layout';
import { AccountsPage } from './pages/AccountsPage';
import { AdminHomePage } from './pages/AdminHomePage';
import { CreateEditStudyPage } from './pages/CreateEditStudyPage';
import { GenomeUploadPage } from './pages/GenomeUploadPage';
import { GiveHealthProfesionalAccessPage } from './pages/GiveHealthProfesionalAccessPage';
import { HealthDataOverviewPage } from './pages/HealthDataOverviewPage';
import { HealthProfessionalHomePage } from './pages/HealthProfessionalHomePage';
import { HomePage } from './pages/HomePage';
import { ImagingUploadPage } from './pages/ImagingUploadPage';
import { LoginPage } from './pages/LoginPage';
import { PatientPage } from './pages/PatientPage';
import { PatientsListPage } from './pages/PatientsListPage';
import { RegisterAccountPage } from './pages/RegisterAccountPage';
import { ResearcherHomePage } from './pages/ResearcherHomePage';
import { SharerHomePage } from './pages/SharerHomePage';
import { StudiesPage } from './pages/StudiesPage';
import { StudyPage } from './pages/StudyPage';
import './styles/App.css';
import { AccountType } from './types/enums.d';
import { ViewModels } from './types/viewModels';

function App() {

    const [loggedInUser, setLoggedInUser] = useState<ViewModels.LoggedInUserViewModel>();
    const navigate = useNavigate();
    const onLoggedIn = (userViewModel: ViewModels.LoggedInUserViewModel) => {
        if (userViewModel.authenticationResult.isAuthenticated) {
            apiClient.setAccessToken(userViewModel.authenticationResult.accessToken!);
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
                    <Route path="/patient/:id" element={<PatientPage />} />
                    <Route path="/giveaccess/healthprofessional" element={<GiveHealthProfesionalAccessPage />} />
                    <Route path="/" element={userTypeHomePage} />
                    <Route path="*" element={userTypeHomePage} />
                </Routes>
            </Layout>
        </UserContext.Provider>
    );
}

export default App;
 