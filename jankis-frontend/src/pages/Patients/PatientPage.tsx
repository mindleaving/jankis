import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, FormControl, InputGroup, Tab, TabContainer, Tabs } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { PatientProfileJumbotron } from '../../components/Patients/PatientProfileJumbotron';
import { formatAdmission } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { PatientParams } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';

interface PatientPageProps extends RouteComponentProps<PatientParams> {}

export const PatientPage = (props: PatientPageProps) => {

    const id = props.match.params.patientId;

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const [ selectedAdmissionId, setSelectedAdmissionId ] = useState<string>();
    const [ notes, setNotes ] = useState<Models.PatientNote[]>([]);
    const [ observations, setObservations ] = useState<Models.Observation[]>([]);
    const [ testResults, setTestResults ] = useState<Models.IDiagnosticTestResult[]>([]);
    const [ documents, setDocuments ] = useState<Models.PatientDocument[]>([]);
    const isHistoricAdmission = selectedAdmissionId && admissions.find(x => x.id === selectedAdmissionId)?.dischargeTime;
    const history = useHistory();

    useEffect(() => {
        if(!id) return;
        const loadPatient = buildLoadObjectFunc<ViewModels.PatientOverviewViewModel>(
            `api/patients/${id}/overviewviewmodel`,
            {},
            resolveText('Patient_CouldNotLoad'),
            vm => {
                setProfileData(vm.profileData);
                setAdmissions(vm.admissions);
                setSelectedAdmissionId(vm.admissions.length > 0 ? vm.admissions[vm.admissions.length-1].id : undefined);
                setNotes(vm.notes);
                setObservations(vm.observations);
                setTestResults(vm.testResults);
                setDocuments(vm.documents);
            },
            () => setIsLoading(false)
        );
        loadPatient();
    }, [ id ]);

    if(!id) {
        return (<h1>{resolveText('MissingID')}</h1>);
    }
    if(isLoading || !profileData) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    return (
        <>
            <Row className="mb-1">
                <Col></Col>
                <Col xs="auto">
                    <InputGroup>
                        <Button className="mx-1">&lt;</Button>
                        <FormControl
                            as="select"
                            value={selectedAdmissionId ?? ''}
                            onChange={(e:any) => setSelectedAdmissionId(e.target.value)}
                        >
                            {admissions.length > 0 
                            ? admissions.map(admission => (
                                <option key={admission.id} value={admission.id}>{formatAdmission(admission)}</option>
                            ))
                            : <option value="" disabled>{resolveText('NoAdmissions')}</option>}
                        </FormControl>
                        <Button className="mx-1">&gt;</Button>
                    </InputGroup>
                </Col>
            </Row>
            {isHistoricAdmission
            ? <Alert style={{ position: 'sticky' }} variant="danger">
                {resolveText('HistoricAdmissionAlert')}
                <Button className="mx-1" variant="link" onClick={() => setSelectedAdmissionId(admissions[admissions.length-1].id)}>{resolveText('GoToLatestAdmission')}</Button>
            </Alert>
            : null}
            <Row>
                <Col lg={6}>
                    <PatientProfileJumbotron
                        profileData={profileData}
                    />
                </Col>
                <Col lg={6}>
                    <Card>
                        <Card.Header>{resolveText('Patient_Actions')}</Card.Header>
                        <Card.Body>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/create/note`)}>{resolveText('Action_AddNote')}</Button>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/create/observation`)}>{resolveText('Action_AddObservation')}</Button>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/add/medication`)}>{resolveText('Action_AddMedication')}</Button>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/add/equipment`)}>{resolveText('Action_AddEquipment')}</Button>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/create/testresult`)}>{resolveText('Action_AddTestResult')}</Button>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/create/document`)}>{resolveText('Action_AddDocument')}</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Tabs defaultActiveKey="overview">
                <Tab eventKey="overview" title={resolveText('Patient_Overview')}>

                </Tab>
                <Tab eventKey="notes" title={resolveText('Patient_Notes')}>

                </Tab>
                <Tab eventKey="observations" title={resolveText('Patient_Observations')}>

                </Tab>
                <Tab eventKey="medications" title={resolveText('Patient_Medications')}>

                </Tab>
                <Tab eventKey="equipment" title={resolveText('Patient_Equipment')}>

                </Tab>
                <Tab eventKey="testResults" title={resolveText('Patient_TestResults')}>

                </Tab>
                <Tab eventKey="documents" title={resolveText('Patient_Documents')}>

                </Tab>
            </Tabs>
        </>
    );

}