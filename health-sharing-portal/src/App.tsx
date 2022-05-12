import './localComponents/styles/App.css';
import './sharedCommonComponents/styles/common.css';
import './sharedHealthComponents/styles/healthrecord.css';

import { ReactNode, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Layout } from './localComponents/components/Layout';
import UserContext from './localComponents/contexts/UserContext';
import { AccountsPage } from './localComponents/pages/UserManagement/AccountsPage';
import { AdminHomePage } from './localComponents/pages/Admin/AdminHomePage';
import { LoginPage } from './localComponents/pages/LoginPage';
import { PatientsListPage } from './localComponents/pages/HealthProfessional/PatientsListPage';
import { RegisterAccountPage } from './localComponents/pages/UserManagement/RegisterAccountPage';
import { ResearcherHomePage } from './localComponents/pages/Researcher/ResearcherHomePage';
import { SharerHomePage } from './localComponents/pages/Sharer/SharerHomePage';
import { AccountType } from './localComponents/types/enums.d';
import { ViewModels } from './localComponents/types/viewModels';
import { ApiClient, apiClient } from './sharedCommonComponents/communication/ApiClient';
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
import { HealthProfessionalHomePage } from './localComponents/pages/HealthProfessional/HealthProfessionalHomePage';
import { HomePage } from './localComponents/pages/HomePage';
import { StudiesPage } from './localComponents/pages/Researcher/StudiesPage';
import { StudyPage } from './localComponents/pages/Researcher/StudyPage';
import { GenomeUploadPage } from './sharedHealthComponents/pages/Patients/GenomeUploadPage';
import { GiveHealthProfesionalAccessPage } from './localComponents/pages/Sharer/GiveHealthProfesionalAccessPage';
import { HealthRecordPage } from './localComponents/pages/Sharer/HealthRecordPage';
import { ReceiveHealthProfessionalAccessPage } from './localComponents/pages/HealthProfessional/ReceiveHealthProfessionalAccessPage';
import { SharedAccessListPage } from './localComponents/pages/Sharer/SharedAccessListPage';
import { OfferStudyParticipationPage } from './localComponents/pages/Sharer/OfferStudyParticipationPage';
import { CreateEditStudyPage } from './localComponents/pages/Researcher/CreateEditStudyPage';
import { CreateEditQuestionnairePage } from './sharedHealthComponents/pages/CreateEditQuestionnairePage';
import { StudyEnrollmentReviewPage } from './localComponents/pages/Researcher/StudyEnrollmentReviewPage';
import { CreateDiagnosisPage } from './sharedHealthComponents/pages/Patients/CreateDiagnosisPage';
import { AnswerQuestionnairePage } from './sharedHealthComponents/pages/Patients/AnswerQuestionnairePage';
import { AssignQuestionnairePage } from './sharedHealthComponents/pages/Patients/AssignQuestionnairePage';
import { ImagingUploadPage } from './sharedHealthComponents/pages/Patients/ImagingUploadPage';
import { GenomeExplorationPage } from './sharedHealthComponents/pages/Patients/GenomeExplorationPage';
import { ImagingExplorationPage } from './sharedHealthComponents/pages/Patients/ImagingExplorationPage';
import { differenceInMilliseconds } from 'date-fns';
import { extractJwtBody } from './sharedCommonComponents/helpers/JwtHelpers';
import { RequestEmergencyAccessPage } from './localComponents/pages/HealthProfessional/RequestEmergencyAccessPage';
import { EditPersonPage } from './sharedHealthComponents/pages/Patients/EditPersonPage';
import { CreateEmergencyAccessTokenPage } from './localComponents/pages/Sharer/CreateEmergencyAccessTokenPage';
import { EmergencyPage } from './localComponents/pages/EmergencyPage';
import { NoUserLayout } from './localComponents/components/NoUserLayout';
import { Models } from './localComponents/types/models';
import { CreateMedicalProcedurePage } from './sharedHealthComponents/pages/Patients/CreateMedicalProcedurePage';
import { AddMedicationPage } from './sharedHealthComponents/pages/Medication/AddMedicationPage';
import { reset, useAppDispatch } from './localComponents/redux/store/healthRecordStore';
import { AddImmunizationPage } from './sharedHealthComponents/pages/Medication/AddImmunizationPage';
import { CreateEditDrugPage } from './sharedHealthComponents/pages/Medication/CreateEditDrugPage';

const accessTokenSessionStorageKey = "accessToken";
const userSessionStorageKey = "loggedInUser";
defaultGlobalizer.instance = new Globalizer("de", "en", [ germanTranslation, englishTranslation ]);
apiClient.instance = window.location.hostname.toLowerCase() === "localhost"
    ? new ApiClient(window.location.hostname, 44303)
    : new ApiClient(window.location.hostname, 443);
if(!!sessionStorage.getItem(accessTokenSessionStorageKey)) {
    apiClient.instance!.setAccessToken(sessionStorage.getItem(accessTokenSessionStorageKey)!);
}
interface AppProps {}
export const App = (props: AppProps) => {

    const dispatch = useAppDispatch();
    const [loggedInUser, setLoggedInUser] = useState<ViewModels.IUserViewModel | undefined>(
        !!sessionStorage.getItem(userSessionStorageKey) 
            ? JSON.parse(sessionStorage.getItem(userSessionStorageKey)!)
            : undefined
        );
    const navigate = useNavigate();
    const onNewAccessToken = (authenticationResult: Models.AuthenticationResult) => {
        if (authenticationResult.isAuthenticated) {
            apiClient.instance!.setAccessToken(authenticationResult.accessToken!);
            sessionStorage.setItem(accessTokenSessionStorageKey, authenticationResult.accessToken!);
            const jwtBody = extractJwtBody(authenticationResult.accessToken!);
            const expirationDateTime = new Date(jwtBody.exp*1000);
            const now = new Date();
            const millisecondsUntilExpiration = differenceInMilliseconds(expirationDateTime, now);
            setTimeout(() => onLogOut(), millisecondsUntilExpiration-60*1000);
        }
    }
    const onLoggedIn = (userViewModel: ViewModels.IUserViewModel, redirectUrl?: string) => {
        sessionStorage.setItem(userSessionStorageKey, JSON.stringify(userViewModel));
        setLoggedInUser(userViewModel);
        navigate(redirectUrl ?? "/");
    }
    const onLogOut = () => {
        setLoggedInUser(undefined);
        sessionStorage.removeItem(accessTokenSessionStorageKey);
        sessionStorage.removeItem(userSessionStorageKey);
        dispatch(reset());
        navigate("/");
    }

    if (!loggedInUser || !loggedInUser.accountId || !loggedInUser.profileData) {
        return (
            <NoUserLayout>
                <Routes>
                    <Route path="/emergency/:emergencyToken" element={<EmergencyPage onNewAccessToken={onNewAccessToken} onGuestLogin={onLoggedIn} />} />
                    <Route path="/login/:accountType" element={<LoginPage onNewAccessToken={onNewAccessToken} onLoggedIn={onLoggedIn} />} />
                    <Route path="/register/:accountType" element={<RegisterAccountPage />} />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </NoUserLayout>
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

    interface Route {
        path: string;
        element: ReactNode;
        audience: AccountType[];
    };
    const routes: Route[] = [
        { path: "/create/drug", element: <CreateEditDrugPage />, audience: [ AccountType.Admin, AccountType.HealthProfessional, AccountType.Researcher, AccountType.Sharer ]},
        { path: '/create/study', element: <CreateEditStudyPage />, audience: [ AccountType.Researcher ]},
        { path: '/edit/study/:id', element: <CreateEditStudyPage />, audience: [ AccountType.Researcher ]},
        { path: '/study/:studyId', element: <StudyPage />, audience: [ AccountType.Researcher, AccountType.Sharer, AccountType.Admin ]},
        { path: '/study/:studyId/offerparticipation', element: <OfferStudyParticipationPage />, audience: [ AccountType.Sharer ]},
        { path: '/study/:studyId/enrollment/:enrollmentId/review', element: <StudyEnrollmentReviewPage />, audience: [ AccountType.Researcher ]},
        { path: '/studies', element: <StudiesPage />, audience: [ AccountType.Researcher, AccountType.Sharer, AccountType.Admin ]},
        { path: '/create/questionnaire', element: <CreateEditQuestionnairePage />, audience: [ AccountType.Researcher, AccountType.HealthProfessional ]},
        { path: '/edit/questionnaire/:id', element: <CreateEditQuestionnairePage />, audience: [ AccountType.Researcher, AccountType.HealthProfessional ]},
        { path: '/giveaccess/healthprofessional/:accessInviteId', element: <GiveHealthProfesionalAccessPage />, audience: [ AccountType.Sharer ]},
        { path: '/giveaccess/healthprofessional', element: <GiveHealthProfesionalAccessPage />, audience: [ AccountType.Sharer ]},
        { 
            path: '/accessinvites/:accessInviteId', 
            element: loggedInUser.accountType === AccountType.Sharer ? <GiveHealthProfesionalAccessPage /> : <ReceiveHealthProfessionalAccessPage />, 
            audience: [ AccountType.Sharer, AccountType.HealthProfessional ]
        },
        { path: '/sharedaccess', element: <SharedAccessListPage />, audience: [ AccountType.Sharer ]},
        { path: '/create/emergency', element: <RequestEmergencyAccessPage />, audience: [ AccountType.HealthProfessional ]},
        { path: '/emergency/:emergencyToken', element: <RequestEmergencyAccessPage />, audience: [ AccountType.HealthProfessional ]},
        { path: '/create/emergency', element: <CreateEmergencyAccessTokenPage />, audience: [ AccountType.Sharer ]},
        { path: '/show/emergencytoken/:accessId', element: <CreateEmergencyAccessTokenPage />, audience: [ AccountType.Sharer ]},

        { path: '/accounts', element: <AccountsPage />, audience: [ AccountType.Admin ]},
        { path: '/edit/person/:personId', element: <EditPersonPage />, audience: [ AccountType.Sharer] },

        { path: '/patients', element: <PatientsListPage />, audience: [ AccountType.HealthProfessional ]},

        { path: '/healthrecord/:personId', element: <HealthRecordPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/timeline', element: <PatientTimelinePage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/medications', element: <PatientMedicationsPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/add/medication', element: <AddMedicationPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/add/immunization', element: <AddImmunizationPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/edit/immunization/:id', element: <AddImmunizationPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/create/testresult', element: <CreatePatientTestResultPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/create/procedure', element: <CreateMedicalProcedurePage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/edit/procedure/:entryId', element: <CreateMedicalProcedurePage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/create/observation', element: <CreatePatientObservationPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/create/diagnosis', element: <CreateDiagnosisPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/edit/diagnosis/:entryId', element: <CreateDiagnosisPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/create/document', element: <CreatePatientDocumentPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/create/note', element: <CreatePatientNotePage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/add/questionnaire', element: <AssignQuestionnairePage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/upload/imaging', element: <ImagingUploadPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/imaging/:dicomStudyId', element: <ImagingExplorationPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/upload/genome', element: <GenomeUploadPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/genome', element: <GenomeExplorationPage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.Researcher ]},
        { path: '/healthrecord/:personId/questionnaire/:questionnaireId/answer', element: <AnswerQuestionnairePage />, audience: [ AccountType.Sharer ]},
        { path: '/healthrecord/:personId/questionnaire/:questionnaireId/answer/:answerId', element: <AnswerQuestionnairePage />, audience: [ AccountType.Sharer ]},
        { path: '/medicationschedules/:scheduleId/edit', element: <EditMedicationSchedulePage />, audience: [ AccountType.Sharer, AccountType.HealthProfessional, AccountType.EmergencyGuest, AccountType.Researcher ]},
    ]

    return (
        <UserContext.Provider value={loggedInUser}>
            <Layout onLogOut={onLogOut}>
                <Routes>
                    {routes
                        .filter(x => x.audience.includes(loggedInUser.accountType as AccountType))
                        .map(route => <Route key={route.path} path={route.path} element={route.element} />)}

                    <Route path="/" element={userTypeHomePage} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Layout>
        </UserContext.Provider>
    );
}
 