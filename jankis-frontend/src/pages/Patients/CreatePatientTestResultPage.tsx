import React, { useEffect, useState } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { PatientAutocomplete } from '../../components/Autocompletes/PatientAutocomplete';
import { TestResultsForm } from '../../components/Patients/TestResultsForm';
import { formatAdmission } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { PatientParams } from '../../types/frontendTypes';
import { Models } from '../../types/models';

interface CreatePatientTestResultPageProps extends RouteComponentProps<PatientParams> {}

export const CreatePatientTestResultPage = (props: CreatePatientTestResultPageProps) => {

    const matchedPatientId = props.match.params.patientId;
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [admissions, setAdmissions] = useState<Models.Admission[]>([]);
    const [admissionId, setAdmissionId] = useState<string>();
    const history = useHistory();

    useEffect(() => {
        if(!matchedPatientId) return;
        const loadProfileData = buildLoadObjectFunc<Models.Person>(
            `api/persons/${matchedPatientId}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            setProfileData
        );
        loadProfileData();
    }, [ matchedPatientId ]);
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
            {profileData 
            ? <TestResultsForm 
                patientId={profileData.id} 
                admissionId={admissionId} 
                onStore={() => history.goBack()}
            /> : null}
        </>
    );

}