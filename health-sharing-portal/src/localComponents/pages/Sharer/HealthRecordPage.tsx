import { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { BasicInformationBox } from '../../components/Sharer/BasicInformationBox';
import { PatientDataTabControl } from '../../../sharedHealthComponents/components/Patients/PatientDataTabControl';
import { PatientActionsCard } from '../../../sharedHealthComponents/components/Patients/PatientActionsCard';
import { HealthRecordAction } from '../../../sharedHealthComponents/types/frontendTypes';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../sharedHealthComponents/redux/store/healthRecordStore';
import { fetchHealthRecordForPerson } from '../../../sharedHealthComponents/redux/slices/healthRecordsSlice';

interface HealthRecordPageProps {}

export const HealthRecordPage = (props: HealthRecordPageProps) => {

    const { personId } = useParams();
    const isLoading = useAppSelector(state => state.healthRecords.isLoading);
    const dispatch = useAppDispatch();
    const profileData = useAppSelector(state => state.persons.items.find(x => x.id === personId));

    useEffect(() => {
        if(!personId) {
            return;
        }
        dispatch(fetchHealthRecordForPerson(personId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ personId ]);

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!profileData) {
        return (<h3>{resolveText("Patient_CouldNotLoad")}</h3>);
    }
    

    if(!personId) {
        return (<h1>{resolveText('MissingID')}</h1>);
    }
    if(isLoading || !profileData) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    const actions: HealthRecordAction[] = [
        { path: `/healthrecord/${personId}/create/note`, textResourceId: 'Action_AddNote' },
        { path: `/healthrecord/${personId}/create/observation`, textResourceId: 'Action_AddObservation' },
        { path: `/healthrecord/${personId}/create/diagnosis`, textResourceId: 'Action_AddDiagnosis' },
        { path: `/healthrecord/${personId}/add/medication`, textResourceId: 'Action_AddMedication' },
        { path: `/healthrecord/${personId}/create/testresult`, textResourceId: 'Action_AddTestResult' },
        { path: `/healthrecord/${personId}/create/procedure`, textResourceId: 'Action_AddMedicalProcedure' },
        { path: `/healthrecord/${personId}/create/document`, textResourceId: 'Action_AddDocument' },
        { path: `/healthrecord/${personId}/add/questionnaire`, textResourceId: 'Action_AddQuestionnaire' },
        // { path: `/healthrecord/${personId}/order/service`, textResourceId: 'Action_OrderService' },
    ]

    return (
        <>
            <Row>
                <Col xl={6} className="mb-2">
                    <BasicInformationBox 
                        profileData={profileData}
                    />
                </Col>
                <Col xl={6}>
                    <PatientActionsCard 
                        personId={personId}
                        actions={actions} 
                    />
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col>
                    <PatientDataTabControl
                        personId={personId}
                    />
                </Col>
            </Row>
        </>
    );

}