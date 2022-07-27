import { useEffect, useState } from 'react';
import { Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { PatientAutocomplete } from '../../components/Autocompletes/PatientAutocomplete';
import { ObservationsForm } from '../../components/Observations/ObservationsForm';

interface CreatePatientObservationPageProps { }

export const CreatePatientObservationPage = (props: CreatePatientObservationPageProps) => {

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
            <h1>{resolveText('Observation')}</h1>
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
            ? <ObservationsForm 
                personId={profileData.id} 
                onStore={() => navigate(-1)}
            /> : null}
    </>);

}