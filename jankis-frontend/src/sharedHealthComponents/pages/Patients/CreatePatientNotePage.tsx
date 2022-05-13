import { FormEvent, useContext, useEffect, useState } from 'react';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid} from 'uuid';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { PatientAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/PatientAutocomplete';
import UserContext from '../../../localComponents/contexts/UserContext';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { addNote, loadNote } from '../../redux/slices/notesSlice';
import { loadPerson } from '../../redux/slices/personsSlice';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';

interface CreatePatientNotePageProps {}

export const CreatePatientNotePage = (props: CreatePatientNotePageProps) => {

    const { personId, id } = useParams();
    const user = useContext(UserContext);

    const matchedProfileData = useAppSelector(state => state.persons.items.find(x => x.id === personId));
    const matchedNote = useAppSelector(state => state.notes.items.find(x => x.id === id));
    const [ profileData, setProfileData ] = useState<Models.Person | undefined>(matchedProfileData);
    const [ timestamp, setTimestamp ] = useState<Date>(new Date());
    const [ message, setMessage ] = useState<string>('');
    const isStoring = useAppSelector(x => x.notes.isSubmitting);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!personId) return;
        dispatch(loadPerson({ personId }));
    }, [ personId ]);

    useEffect(() => {
        if(!profileData) {
            setProfileData(matchedProfileData);
        }
    }, [ matchedProfileData ]);

    useEffect(() => {
        if(!id) {
            return;
        }
        dispatch(loadNote({ args: id }));
    }, [ id ]);

    useEffect(() => {
        if(!matchedNote) {
            return;
        }
        setTimestamp(matchedNote.timestamp);
        setMessage(matchedNote.message);
    }, [ matchedNote ]);

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
            id: id ?? uuid(),
            personId: profileData!.id,
            createdBy: user!.accountId,
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === profileData!.id,
            timestamp: timestamp,
            type: HealthRecordEntryType.Note,
            message: message
        };
    }

    return (
        <>
            <h1>{resolveText('Note')}</h1>
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
                <RowFormGroup
                    type='datetime'
                    label={resolveText("Document_Timestamp")}
                    value={timestamp}
                    onChange={setTimestamp}
                />
                <FormGroup>
                    <FormLabel>{resolveText('Note_Message')}</FormLabel>
                    <FormControl required
                        as="textarea"
                        value={message}
                        onChange={(e:any) => setMessage(e.target.value)}
                    />
                    {/* <MedicalTextEditor /> */}
                </FormGroup>
                <StoreButton
                    type="submit"
                    isStoring={isStoring}
                />
            </Form>
        </>
    );

}