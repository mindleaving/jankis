import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { loadAdmission } from '../../../sharedHealthComponents/redux/slices/admissionsSlice';
import { CardsAdmissionView } from '../../components/Patients/CardsAdmissionView';
import { PatientProfileJumbotron } from '../../components/Patients/PatientProfileJumbotron';
import { TimelineAdmissionView } from '../../components/Patients/TimelineAdmissionView';
import { useAppDispatch, useAppSelector } from '../../redux/store/healthRecordStore';

interface AdmissionPageProps {}
enum AdmissionViewType {
    Cards,
    Timeline
}
export const AdmissionPage = (props: AdmissionPageProps) => {

    const { admissionId } = useParams();

    const isLoading = useAppSelector(state => state.admissions.isLoading);
    const admission = useAppSelector(state => state.admissions.items.find(x => x.id === admissionId));
    const [ viewType, setViewType ] = useState<AdmissionViewType>(AdmissionViewType.Cards);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!admissionId) {
            return;
        }
        dispatch(loadAdmission({ args: admissionId }));
    }, [ admissionId ]);

    if(!admissionId) {
        return (<h1>{resolveText('NotFound')}</h1>);
    }
    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <PatientProfileJumbotron personId={admission!.profileData.id} />
            <Row>
                <Col></Col>
                <Col xs="auto">
                    <ButtonGroup>
                        <Button 
                            onClick={() => setViewType(AdmissionViewType.Cards)}
                            title={resolveText('Admission_Views_Cards')}
                        >
                            <i className="fa fa-list" />
                        </Button>
                        <Button 
                            onClick={() => setViewType(AdmissionViewType.Timeline)}
                            title={resolveText('Admission_Views_Timeline')}
                        >
                            <i className="fa fa-clock"/>
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            {/* {viewType === AdmissionViewType.Cards 
                ? <CardsAdmissionView admission={admission!} />
                : <TimelineAdmissionView 
                    admission={admission!}
                />
            } */}
        </>
    );

}