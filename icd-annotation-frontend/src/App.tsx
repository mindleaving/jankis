import React, { useState } from 'react';
import Switch from 'react-bootstrap/esm/Switch';
import { Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Layout } from './Layout';
import { DiseaseListPage } from './pages/DiseaseListPage';
import { DiseaseEditFormPage } from './pages/DiseaseEditFormPage';
import { PatientsListPage } from './pages/PatientsListPage';
import { PatientQuestionairePage } from './pages/PatientQuestionairePage';
import { SymptomsListPage } from './pages/SymptomsListPage';
import { ObservationsListPage } from './pages/ObservationsListPage';
import { IcdTutorialPage } from './pages/IcdTutorialPage';
import { InitialsModal } from './modals/InitialsModal';
import { TutorialsPage } from './pages/TutorialsPage';
import { AndroidAppTutorialPage } from './pages/AndroidAppTutorialPage';
import { PatientQuestionaireTutorialPage } from './pages/PatientQuestionaireTutorialPage';
import { DocSupportTutorialPage } from './pages/DocSupportTutorialPage';
import Cookies from 'js-cookie';
import { BodyStructuresListPage } from './pages/BodyStructuresListPage';
import { LegalPage } from './pages/LegalPage';

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
        requestClose={() => setShowInitialsModal(false)}
      />
      <Switch>
        <Route 
          exact path="/" 
          render={props => <HomePage />}
        />
        <Route 
          exact path="/questionaire"
          render={props => <PatientQuestionairePage />}
        />
        <Route 
          exact path="/patients" 
          render={props => <PatientsListPage />}
        />
        <Route 
          exact path="/diseases" 
          render={props => <DiseaseListPage />}
        />
        <Route 
          path="/diseases/:icdCode/edit" 
          render={props => <DiseaseEditFormPage {...props} username={initials} />}
        />
        <Route 
          path="/diseases/new"
          render={props => <DiseaseEditFormPage {...props} />}
        />
        <Route 
          exact path="/symptoms" 
          render={props => <SymptomsListPage />}
        />
        <Route 
          exact path="/observations" 
          render={props => <ObservationsListPage />}
        />
        <Route 
          exact path="/bodystructures" 
          render={props => <BodyStructuresListPage />}
        />
        <Route 
          exact path="/tutorials" 
          render={props => <TutorialsPage />}
        />
        <Route 
          exact path="/tutorials/icd11" 
          render={props => <IcdTutorialPage />}
        />
        <Route 
          exact path="/tutorials/patientsquestionaire" 
          render={props => <PatientQuestionaireTutorialPage />}
        />
        <Route 
          exact path="/tutorials/docsupport" 
          render={props => <DocSupportTutorialPage />}
        />
        <Route 
          exact path="/tutorials/app" 
          render={props => <AndroidAppTutorialPage />}
        />
        <Route 
          exact path="/legal" 
          render={props => <LegalPage />}
        />
      </Switch>
    </Layout>
  );
}

export default App;
