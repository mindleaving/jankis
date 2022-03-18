import React, { useEffect, useState } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { PatientAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/PatientAutocomplete';
import { formatAdmission } from '../../../sharedHealthComponents/helpers/Formatters';

interface CreatePatientTestResultPageProps {}

export const CreatePatientTestResultPage = (props: CreatePatientTestResultPageProps) => {

    const { personId } = useParams();
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [admissions, setAdmissions] = useState<Models.Admission[]>([]);
    const [admissionId, setAdmissionId] = useState<string>();

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
    useEffect(() => {
        if(!profileData) {
            setAdmissions([]);
            return;
        }
        const loadAdmissions = buildLoadObjectFunc<Models.Admission[]>(
            `api/patients/${profileData.id}/admissions`,
            {},
            resolveText('Admissions_CouldNotLoad'),
            setAdmissions
        );
        loadAdmissions();
    }, [ profileData]);

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
            {admissions.length > 0
            ? <FormGroup as={Row}>
                <FormLabel column>{resolveText('Admission')}</FormLabel>
                <Col>
                    <FormControl
                        as="select"
                        value={admissionId}
                        onChange={(e: any) => setAdmissionId(e.target.value)}
                    >
                        {admissions.map(admission => (
                            <option value={admission.id} key={admission.id}>{formatAdmission(admission)}</option>
                        ))}
                    </FormControl>
                </Col>
            </FormGroup>
            : null}
            {/* {profileData 
            ? <TestResultsForm 
                personId={profileData.id} 
                admissionId={admissionId} 
                onStore={() => navigate(-1)}
            /> : null} */}
        </>
    );

}