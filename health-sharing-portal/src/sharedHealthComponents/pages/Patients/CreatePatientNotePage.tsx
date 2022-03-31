import { FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid} from 'uuid';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { PatientAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/PatientAutocomplete';
import { MedicalTextEditor } from '../../../sharedHealthComponents/components/MedicalTextEditor/MedicalTextEditor';
import UserContext from '../../../localComponents/contexts/UserContext';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';

interface CreatePatientNotePageProps {}

export const CreatePatientNotePage = (props: CreatePatientNotePageProps) => {

    const { personId } = useParams();
    const user = useContext(UserContext);

    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ message, setMessage ] = useState<string>('');
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const navigate = useNavigate();
    const id = useMemo(() => uuid(), []);

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
            () => navigate(-1), //push(`/healthrecord/${personId}`),
            () => setIsStoring(false)
        );
    }
    const buildNote = (): Models.PatientNote => {
        return {
            id: id,
            personId: profileData!.id,
            createdBy: user!.username,
            timestamp: new Date(),
            type: HealthRecordEntryType.Note,
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