import { FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid} from 'uuid';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { PatientAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/PatientAutocomplete';
import { MedicalTextEditor } from '../../../sharedHealthComponents/components/MedicalTextEditor/MedicalTextEditor';
import UserContext from '../../../localComponents/contexts/UserContext';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { addNote } from '../../redux/slices/notesSlice';

interface CreatePatientNotePageProps {}

export const CreatePatientNotePage = (props: CreatePatientNotePageProps) => {

    const { personId } = useParams();
    const user = useContext(UserContext);

    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ message, setMessage ] = useState<string>('');
    const isStoring = useAppSelector(x => x.notes.isSubmitting);
    const navigate = useNavigate();
    const id = useMemo(() => uuid(), []);
    const dispatch = useAppDispatch();

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
        const note = buildNote();
        dispatch(addNote({ 
            args: note, 
            body: note, 
            onSuccess: () => navigate(-1)
        }));
    }
    const buildNote = (): Models.PatientNote => {
        return {
            id: id,
            personId: profileData!.id,
            createdBy: user!.accountId,
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === profileData!.id,
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