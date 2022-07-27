import '../../../sharedHealthComponents/styles/healthrecord.css';
import { useEffect, useState } from 'react';
import { Alert, Button, FormControl, InputGroup } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router';
import { PatientProfileJumbotron } from '../../components/Patients/PatientProfileJumbotron';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { formatAdmission } from '../../../sharedHealthComponents/helpers/Formatters';
import { PatientDataTabControl } from '../../../sharedHealthComponents/components/Patients/PatientDataTabControl';
import { PatientActionsCard } from '../../../sharedHealthComponents/components/Patients/PatientActionsCard';
import { HealthRecordAction } from '../../../sharedHealthComponents/types/frontendTypes';
import { useAppDispatch, useAppSelector } from '../../redux/store/healthRecordStore';
import { fetchHealthRecordForPerson } from '../../redux/actions/healthRecordActions';

interface PatientPageProps {}

export const PatientPage = (props: PatientPageProps) => {

    const { personId } = useParams();

    const isLoading = useAppSelector(x => x.healthRecords.isLoading);
    const [ currentBedOccupancy, setBedOccupancy ] = useState<Models.BedOccupancy>();
    const admissions = useAppSelector(x => x.admissions.items.filter(x => x.personId === personId));
    const [ selectedAdmissionId, setSelectedAdmissionId ] = useState<string>();
    const [ subscription, setSubscription ] = useState<Models.Subscriptions.PatientSubscription>();
    const isHistoricAdmission = selectedAdmissionId && admissions.find(x => x.id === selectedAdmissionId)?.dischargeTime;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!personId) {
            return;
        }
        dispatch(fetchHealthRecordForPerson({ personId }));
    }, [ personId ]);


    if(!personId) {
        return (<h1>{resolveText('MissingID')}</h1>);
    }
    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    const actions: HealthRecordAction[] = [
        { path: `/healthrecord/${personId}/create/note`, textResourceId: 'Action_AddNote' },
        { path: `/healthrecord/${personId}/create/observation`, textResourceId: 'Action_AddObservation' },
        { path: `/healthrecord/${personId}/create/diagnosis`, textResourceId: 'Action_AddDiagnosis' },
        { path: `/healthrecord/${personId}/nursing`, textResourceId: 'Action_AddEquipment' },
        { path: `/healthrecord/${personId}/create/testresult`, textResourceId: 'Action_AddTestResult' },
        { path: `/healthrecord/${personId}/create/document`, textResourceId: 'Action_AddDocument' },
        { path: `/healthrecord/${personId}/add/questionnaire`, textResourceId: 'Action_AddQuestionnaire' },
        { path: `/healthrecord/${personId}/order/service`, textResourceId: 'Action_OrderService' },
        { path: `/healthrecord/${personId}/nursing`, textResourceId: 'Action_Nursing' },
    ]

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
                        personId={personId}
                        showSubscription
                    />
                </Col>
                <Col lg={6}>
                    <PatientActionsCard 
                        personId={personId}
                        actions={actions}
                    />
                </Col>
            </Row>
            <PatientDataTabControl
                personId={personId}
            />
        </>
    );

}