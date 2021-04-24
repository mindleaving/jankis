import React, { useEffect, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { PatientAutocomplete } from '../../components/Autocompletes/PatientAutocomplete';
import { ServiceAutocomplete } from '../../components/Autocompletes/ServiceAutocomplete';
import { RequestServiceForm } from '../../components/Services/RequestServiceForm';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { PatientParams } from '../../types/frontendTypes';
import { Models } from '../../types/models';

interface OrderServiceForPatientPageProps extends RouteComponentProps<PatientParams> {}

export const OrderServiceForPatientPage = (props: OrderServiceForPatientPageProps) => {

    const matchedPatientId = props.match.params.patientId;

    const [ isLoading, setIsLoading] = useState<boolean>(!!matchedPatientId);
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ selectedService, setSelectedService ] = useState<Models.ServiceDefinition>();

    useEffect(() => {
        if(!matchedPatientId) return;
        setIsLoading(true);
        const loadProfileData = buildLoadObjectFunc<Models.Person>(
            `api/persons/${matchedPatientId}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            setProfileData,
            () => setIsLoading(false)
        );
        loadProfileData();
    }, [ matchedPatientId ]);
    
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