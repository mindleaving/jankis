import { useEffect, useState } from 'react';
import { Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { PatientAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/PatientAutocomplete';
import { TestResultsForm } from '../../components/TestResults/TestResultsForm';

interface CreatePatientTestResultPageProps {}

export const CreatePatientTestResultPage = (props: CreatePatientTestResultPageProps) => {

    const { personId } = useParams();
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const navigate = useNavigate();

    useEffect(() => {
        if(!personId) return;
        const loadProfileData = buildLoadObjectFunc<Models.Person>(
            `api/persons/${personId}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            setProfileData
        );
        loadProfileData();
    }, [ personId ]);

    return (
        <>
            <h1>{resolveText('TestResult')}</h1>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Patient')}</FormLabel>
                <Col>
                    <PatientAutocomplete
                        value={profileData}
                        onChange={setProfileData}
                    />
                </Col>
            </FormGroup>
            {profileData 
            ? <TestResultsForm 
                personId={profileData.id} 
                onStore={() => navigate(-1)}
            />
            : null}
        </>
    );

}