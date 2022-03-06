import { FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { StoreButton } from '../../components/StoreButton';
import UserContext from '../../contexts/UserContext';
import { formatAdmission } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { PatientEventType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid} from 'uuid';
import { PatientParams } from '../../types/frontendTypes';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { PatientAutocomplete } from '../../components/Autocompletes/PatientAutocomplete';
import { MedicalTextEditor } from '../../components/MedicalTextEditor/MedicalTextEditor';

interface CreatePatientNotePageProps extends RouteComponentProps<PatientParams> {}

export const CreatePatientNotePage = (props: CreatePatientNotePageProps) => {

    const matchedPatientId = props.match.params.patientId;
    const user = useContext(UserContext);

    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const [ admissionId, setAdmissionId ] = useState<string>();
    const [ message, setMessage ] = useState<string>('');
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const history = useHistory();
    const id = useMemo(() => uuid(), []);

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
        if(!profileData) {
            NotificationManager.error(resolveText('PleaseSelect_Patient'));
            return;
        }
        setIsStoring(true);
        await buidlAndStoreObject<Models.PatientNote>(
            `api/patientnotes/${id}`,
            resolveText('Patient_Note_SuccessfullyStored'),
            resolveText('Patient_Note_CouldNotStore'),
            buildNote,
            () => history.goBack(), //push(`/patients/${patientId}`),
            () => setIsStoring(false)
        );
    }
    const buildNote = (): Models.PatientNote => {
        return {
            id: id,
            patientId: profileData!.id,
            admissionId: admissionId,
            createdBy: user!.username,
            timestamp: new Date(),
            type: PatientEventType.Note,
            message: message
        };
    }

    return (
        <>
            <h1>{resolveText('Patient_Note')}</h1>
            <Form onSubmit={store}>
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
                            onChange={(e:any) => setAdmissionId(e.target.value)}
                        >
                            {admissions.map(admission => (
                                <option value={admission.id} key={admission.id}>{formatAdmission(admission)}</option>
                            ))}
                        </FormControl>
                    </Col>
                </FormGroup>
                : null}
                <FormGroup>
                    <FormLabel>{resolveText('Patient_Note_Message')}</FormLabel>
                    <FormControl required
                        as="textarea"
                        value={message}
                        onChange={(e:any) => setMessage(e.target.value)}
                    />
                    <MedicalTextEditor />
                </FormGroup>
                <StoreButton
                    type="submit"
                    isStoring={isStoring}
                />
            </Form>
        </>
    );

}