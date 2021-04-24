import { Fragment, FormEvent, useEffect, useState } from 'react';
import { Alert, Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';
import { MeasurementType } from '../../types/enums.d';
import { PatientParams } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { StoreButton } from '../../components/StoreButton';
import { formatAdmission, formatObservation } from '../../helpers/Formatters';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { ListFormControl } from '../../components/ListFormControl';
import { apiClient } from '../../communication/ApiClient';
import { PulseMeasurementForm } from '../../components/Patients/PulseMeasurementForm';
import { BloodPressureMeasurementForm } from '../../components/Patients/BloodPressureMeasurementForm';
import { TemperatureMeasurementForm } from '../../components/Patients/TemperatureMeasurementForm';
import { GenericMeasurementForm } from '../../components/Patients/GenericMeasurementForm';
import { v4 as uuid } from 'uuid';
import { PatientAutocomplete } from '../../components/Autocompletes/PatientAutocomplete';

interface CreatePatientObservationPageProps extends RouteComponentProps<PatientParams> { }
interface MeasurementForm {
    id: string;
    measurementType: string;
}

export const CreatePatientObservationPage = (props: CreatePatientObservationPageProps) => {

    const matchedPatientId = props.match.params.patientId;

    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [admissions, setAdmissions] = useState<Models.Admission[]>([]);
    const [admissionId, setAdmissionId] = useState<string>();
    const [ measurementForms, setMeasurementForms ] = useState<MeasurementForm[]>([]);
    const [ observations, setObservations ] = useState<Models.Observation[]>([]);
    const [isStoring, setIsStoring] = useState<boolean>(false);
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

    const store = async (e: FormEvent) => {
        e.preventDefault();
        if (!profileData) {
            NotificationManager.error(resolveText('PleaseSelect_Patient'));
            return;
        }
        setIsStoring(true);
        try {
            for (const observation of observations) {
                await apiClient.put(`api/observations/${observation.id}`, {}, observation);
            }
            NotificationManager.success(resolveText('Patient_Observation_SuccessfullyStored'));
            history.goBack(); //push(`/patients/${patientId}`)
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Patient_Observation_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }

    const addMeasurementForm = (measurementType: string) => {
        setMeasurementForms(measurementForms.concat({
            id: uuid(),
            measurementType
        }));
    }
    const removeMeasurementForm = (measurementFormId: string) => {
        setMeasurementForms(measurementForms.filter(x => x.id !== measurementFormId));
    }
    const addObservation = (observation: Models.Observation, measurementFormId: string) => {
        setObservations(observations.concat(observation));
        removeMeasurementForm(measurementFormId);
    }
    const removeObservation = (observationId: string) => {
        setObservations(observations.filter(x => x.id !== observationId));
    }

    return (
        <>
            <h1>{resolveText('Observation')}</h1>
            <Form onSubmit={store} id="CreatePatientObservationPageForm">
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
            </Form>
            {profileData
            ? <>
            <Row>
                <Col>{resolveText('Observation_MeasurementType')}</Col>
                <Col>
                    <Row>
                        <Col>
                            <Button className="m-1" onClick={() => addMeasurementForm('')}>{resolveText('CreateNew')}</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button size="sm" className="m-1" onClick={() => addMeasurementForm(MeasurementType.Pulse)}>+ {resolveText('MeasurementType_Pulse')}</Button>
                            <Button size="sm" className="m-1" onClick={() => addMeasurementForm(MeasurementType.BloodPressure)}>+ {resolveText('MeasurementType_BloodPressure')}</Button>
                            <Button size="sm" className="m-1" onClick={() => addMeasurementForm(MeasurementType.Temperature)}>+ {resolveText('MeasurementType_Temperature')}</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {measurementForms.map(measurementForm => {
                let headingText;
                let formControl;
                if(measurementForm.measurementType === MeasurementType.Pulse) {
                    headingText = resolveText('MeasurementType_Pulse');
                    formControl =(<PulseMeasurementForm
                            patientId={profileData.id}
                            admissionId={admissionId}
                            onSubmit={(observation) => addObservation(observation, measurementForm.id)}
                            hasSubmitButton
                            submitButtonText={resolveText('Create')}
                        />);
                }
                else if(measurementForm.measurementType === MeasurementType.BloodPressure) {
                    headingText = resolveText('MeasurementType_BloodPressure');
                    formControl = (<BloodPressureMeasurementForm
                            patientId={profileData.id}
                            admissionId={admissionId}
                            onSubmit={(observation) => addObservation(observation, measurementForm.id)}
                            hasSubmitButton
                            submitButtonText={resolveText('Create')}
                        />);
                }
                else if(measurementForm.measurementType === MeasurementType.Temperature) {
                    headingText = resolveText('MeasurementType_Temperature');
                    formControl = (<TemperatureMeasurementForm
                            patientId={profileData.id}
                            admissionId={admissionId}
                            onSubmit={(observation) => addObservation(observation, measurementForm.id)}
                            hasSubmitButton
                            submitButtonText={resolveText('Create')}
                        />);
                } else {
                    formControl = (<GenericMeasurementForm
                        patientId={profileData.id}
                        admissionId={admissionId}
                        onSubmit={(observation) => addObservation(observation, measurementForm.id)}
                        hasSubmitButton
                        submitButtonText={resolveText('Create')}
                    />);
                }
                
                return (<Fragment key={measurementForm.id}>
                    <hr />
                    <Alert dismissible onClose={() => removeMeasurementForm(measurementForm.id)}>
                        <Alert.Heading>{headingText}</Alert.Heading>
                        {formControl}
                    </Alert>
                </Fragment>);
            })}
            <hr className="my-3" />
            <Row>
                <Col>
                    <h3>{resolveText('Observations')}</h3>
                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col>
                    {observations.map(observation => (
                        <Alert 
                            key={observation.id}
                            variant="info" 
                            dismissible
                            onClose={() => removeObservation(observation.id)}
                        >
                            {formatObservation(observation)}
                        </Alert>
                    ))}
                </Col>
            </Row>
            </> : null}
            <StoreButton
                type="submit"
                form="CreatePatientObservationPageForm"
                isStoring={isStoring}
            />
        </>
    );

}