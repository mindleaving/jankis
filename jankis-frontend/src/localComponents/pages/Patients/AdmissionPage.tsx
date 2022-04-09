import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { CardsAdmissionView } from '../../components/Patients/CardsAdmissionView';
import { PatientProfileJumbotron } from '../../components/Patients/PatientProfileJumbotron';
import { TimelineAdmissionView } from '../../components/Patients/TimelineAdmissionView';
import { ViewModels } from '../../types/viewModels';

interface AdmissionPageProps {}
enum AdmissionViewType {
    Cards,
    Timeline
}
export const AdmissionPage = (props: AdmissionPageProps) => {

    const { admissionId } = useParams();

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ admission, setAdmission ] = useState<ViewModels.PatientOverviewViewModel>();
    const [ viewType, setViewType ] = useState<AdmissionViewType>(AdmissionViewType.Cards);

    useEffect(() => {
        if(!admissionId) return;
        const loadAdmission = buildLoadObjectFunc<ViewModels.PatientOverviewViewModel>(
            `api/patients/${admissionId}/overviewviewmodel`,
            {},
            resolveText('Admission_CouldNotLoad'),
            setAdmission,
            () => setIsLoading(false)
        );
        loadAdmission();
    }, [ admissionId ]);

    if(!admissionId) {
        return (<h1>{resolveText('NotFound')}</h1>);
    }
    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <PatientProfileJumbotron profileData={admission!.profileData} />
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
            {viewType === AdmissionViewType.Cards 
                ? <CardsAdmissionView admission={admission!} />
                : <TimelineAdmissionView 
                    admission={admission!}
                    onMarkAsSeen={() => { throw new Error("Not implemented"); }}
                />
            }
        </>
    );

}