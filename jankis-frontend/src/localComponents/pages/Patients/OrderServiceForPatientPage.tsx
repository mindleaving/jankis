import React, { useEffect, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { PatientAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/PatientAutocomplete';
import { ServiceAutocomplete } from '../../components/Autocompletes/ServiceAutocomplete';
import { RequestServiceForm } from '../../components/Services/RequestServiceForm';
import { Models } from '../../types/models';

interface OrderServiceForPatientPageProps {}

export const OrderServiceForPatientPage = (props: OrderServiceForPatientPageProps) => {

    const { patientId } = useParams();

    const [ isLoading, setIsLoading] = useState<boolean>(!!patientId);
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ selectedService, setSelectedService ] = useState<Models.Services.ServiceDefinition>();

    useEffect(() => {
        if(!patientId) return;
        setIsLoading(true);
        const loadProfileData = buildLoadObjectFunc<Models.Person>(
            `api/persons/${patientId}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            setProfileData,
            () => setIsLoading(false)
        );
        loadProfileData();
    }, [ patientId ]);
    
    return (
        <>
            <h1>{resolveText('Patient_OrderService')}</h1>
            <Form>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Patient')}</FormLabel>
                    <Col>
                        <PatientAutocomplete
                            value={profileData}
                            onChange={setProfileData}
                            isLoading={isLoading}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Service')}</FormLabel>
                    <Col>
                        <ServiceAutocomplete
                            value={selectedService}
                            onChange={setSelectedService}
                            isLoading={isLoading}
                        />
                    </Col>
                </FormGroup>
            </Form>
            {selectedService
            ? <RequestServiceForm
                service={selectedService}
                patient={profileData}
            />
            : null}
        </>
    );

}