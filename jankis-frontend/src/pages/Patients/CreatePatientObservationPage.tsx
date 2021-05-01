import { useEffect, useState } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';
import { PatientParams } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { formatAdmission } from '../../helpers/Formatters';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { PatientAutocomplete } from '../../components/Autocompletes/PatientAutocomplete';
import { ObservationsForm } from '../../components/Patients/ObservationsForm';

interface CreatePatientObservationPageProps extends RouteComponentProps<PatientParams> { }

export const CreatePatientObservationPage = (props: CreatePatientObservationPageProps) => {

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
            ? <ObservationsForm 
                patientId={profileData.id} 
                admissionId={admissionId} 
                onStore={() => history.goBack()}
            /> : null}
    </>);

}