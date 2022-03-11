import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { apiClient } from './communication/ApiClient';
import UserContext from './contexts/UserContext';
import { Layout } from './Layout';
import { CreateEditStudyPage } from './pages/CreateEditStudyPage';
import { GenomeUploadPage } from './pages/GenomeUploadPage';
import { HealthDataOverviewPage } from './pages/HealthDataOverviewPage';
import { HomePage } from './pages/HomePage';
import { ImagingUploadPage } from './pages/ImagingUploadPage';
import { LoginPage } from './pages/LoginPage';
import { StudiesPage } from './pages/StudiesPage';
import { StudyPage } from './pages/StudyPage';
import './styles/App.css';
import { ViewModels } from './types/viewModels';

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
            <Routes>
                <Route path="/create/study" element={<CreateEditStudyPage />} />
                <Route path="/edit/study/:id" element={<CreateEditStudyPage />} />
                <Route path="/study/:id" element={<StudyPage />} />
                <Route path="/studies" element={<StudiesPage />} />
                <Route path="/sharer" element={<HealthDataOverviewPage />} />
                <Route path="/sharer/upload/imaging" element={<ImagingUploadPage />} />
                <Route path="/sharer/upload/genome" element={<GenomeUploadPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<HomePage />} />
            </Routes>
        </Layout>
    </UserContext.Provider>
  );
}

export default App;
