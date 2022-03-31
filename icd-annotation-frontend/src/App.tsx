import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './localComponents/pages/HomePage';
import { Layout } from './Layout';
import { DiseaseListPage } from './localComponents/pages/DiseaseListPage';
import { DiseaseEditFormPage } from './localComponents/pages/DiseaseEditFormPage';
import { PatientsListPage } from './localComponents/pages/PatientsListPage';
import { PatientQuestionairePage } from './localComponents/pages/PatientQuestionairePage';
import { SymptomsListPage } from './localComponents/pages/SymptomsListPage';
import { ObservationsListPage } from './localComponents/pages/ObservationsListPage';
import { IcdTutorialPage } from './localComponents/pages/IcdTutorialPage';
import { InitialsModal } from './localComponents/modals/InitialsModal';
import { TutorialsPage } from './localComponents/pages/TutorialsPage';
import { AndroidAppTutorialPage } from './localComponents/pages/AndroidAppTutorialPage';
import { PatientQuestionaireTutorialPage } from './localComponents/pages/PatientQuestionaireTutorialPage';
import { DocSupportTutorialPage } from './localComponents/pages/DocSupportTutorialPage';
import Cookies from 'js-cookie';
import { BodyStructuresListPage } from './localComponents/pages/BodyStructuresListPage';
import { LegalPage } from './localComponents/pages/LegalPage';
import germanTranslation from './localComponents/resources/translation.de.json';
import englishTranslation from './localComponents/resources/translation.en.json';
import { apiClient, ApiClient } from './sharedCommonComponents/communication/ApiClient';
import { defaultGlobalizer, Globalizer } from './sharedCommonComponents/helpers/Globalizer';

defaultGlobalizer.instance = new Globalizer("de", "en", [ germanTranslation, englishTranslation ]);
apiClient.instance = window.location.hostname.toLowerCase() === "localhost"
    ? new ApiClient(window.location.hostname, 44302)
    : new ApiClient(window.location.hostname, 443);

function App() {
  const usernameCookieName = 'username';
  const [initials, setInitials] = useState<string | undefined>(Cookies.get(usernameCookieName));
  const [showInitialsModal, setShowInitialsModal] = useState<boolean>(false);

  const setInitialsAndCloseModal = (str: string) => {
    Cookies.set(usernameCookieName, str, { expires: 1 });
    setInitials(str);
    setShowInitialsModal(false);
  }
  const logout = () => {
    Cookies.remove(usernameCookieName);
    setInitials(undefined);
  }

  return (
    <Layout
      username={initials}
      onLogin={() => setShowInitialsModal(true)}
      onLogout={logout}
    >
      <InitialsModal
        show={showInitialsModal}
        setInitials={setInitialsAndCloseModal}
        requestClose={() => setShowInitialsModal(false)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questionaire" element={<PatientQuestionairePage />} />
        <Route path="/patients" element={<PatientsListPage />} />
        <Route path="/diseases" element={<DiseaseListPage />} />
        <Route path="/diseases/:icdCode/edit" element={<DiseaseEditFormPage username={initials} />} />
        <Route path="/diseases/new" element={<DiseaseEditFormPage />} />
        <Route path="/symptoms" element={<SymptomsListPage />} />
        <Route path="/observations" element={<ObservationsListPage />} />
        <Route path="/bodystructures" element={<BodyStructuresListPage />} />
        <Route path="/tutorials" element={<TutorialsPage />} />
        <Route path="/tutorials/icd11" element={<IcdTutorialPage />} />
        <Route path="/tutorials/patientsquestionaire" element={<PatientQuestionaireTutorialPage />} />
        <Route path="/tutorials/docsupport" element={<DocSupportTutorialPage />} />
        <Route path="/tutorials/app" element={<AndroidAppTutorialPage />} />
        <Route path="/legal" element={<LegalPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
