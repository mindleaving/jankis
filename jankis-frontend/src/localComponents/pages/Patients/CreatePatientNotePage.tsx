import { FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import UserContext from '../../contexts/UserContext';
import { PatientEventType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid} from 'uuid';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { PatientAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/PatientAutocomplete';
import { MedicalTextEditor } from '../../../sharedHealthComponents/components/MedicalTextEditor/MedicalTextEditor';
import { formatAdmission } from '../../../sharedHealthComponents/helpers/Formatters';

interface CreatePatientNotePageProps {}

export const CreatePatientNotePage = (props: CreatePatientNotePageProps) => {

    const { patientId } = useParams();
    const user = useContext(UserContext);

    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const [ admissionId, setAdmissionId ] = useState<string>();
    const [ message, setMessage ] = useState<string>('');
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const navigate = useNavigate();
    const id = useMemo(() => uuid(), []);

    useEffect(() => {
        if(!patientId) return;
        const loadProfileData = buildLoadObjectFunc<Models.Person>(
            `api/persons/${patientId}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            setProfileData
        );
        loadProfileData();
    }, [ patientId ]);
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
        await buildAndStoreObject<Models.PatientNote>(
            `api/patientnotes/${id}`,
            resolveText('Patient_Note_SuccessfullyStored'),
            resolveText('Patient_Note_CouldNotStore'),
            buildNote,
            () => navigate(-1), //push(`/patients/${patientId}`),
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