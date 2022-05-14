import { useEffect, useState } from 'react';
import { Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { PatientAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/PatientAutocomplete';
import { TestResultsForm } from '../../components/TestResults/TestResultsForm';
import { loadPerson } from '../../redux/slices/personsSlice';

interface CreatePatientTestResultPageProps {}

export const CreatePatientTestResultPage = (props: CreatePatientTestResultPageProps) => {

    const { personId } = useParams();
    const matchedProfileData = useAppSelector(state => state.persons.items.find(x => x.id));
    const [ profileData, setProfileData ] = useState<Models.Person | undefined>(matchedProfileData);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!personId) return;
        dispatch(loadPerson({ personId }));
    }, [ personId ]);

    useEffect(() => {
        if(!profileData) {
            setProfileData(matchedProfileData);
        }
    }, [ matchedProfileData]);

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
            />
            : null}
        </>
    );

}