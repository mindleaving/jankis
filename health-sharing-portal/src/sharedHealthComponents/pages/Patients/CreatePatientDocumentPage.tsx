import { FormEvent, useContext, useEffect, useState } from 'react';
import { Alert, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { v4 as uuid } from 'uuid';
import UserContext from '../../../localComponents/contexts/UserContext';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { FileUpload } from '../../../sharedCommonComponents/components/FileUpload';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { PatientAutocomplete } from '../../components/Autocompletes/PatientAutocomplete';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { addDocument, loadDocument } from '../../redux/slices/documentsSlice';

interface CreatePatientDocumentPageProps {}

export const CreatePatientDocumentPage = (props: CreatePatientDocumentPageProps) => {

    const { personId, id } = useParams();
    const user = useContext(UserContext);

    const matchedProfileData = useAppSelector(state => state.persons.items.find(x => x.id === personId));
    const matchedDocument = useAppSelector(state => state.documents.items.find(x => x.id === id));
    const [ profileData, setProfileData ] = useState<Models.Person | undefined>(matchedProfileData);
    const [ timestamp, setTimestamp ] = useState<Date>(new Date());
    const [ note, setNote ] = useState<string>('');
    const [ file, setFile ] = useState<File>();
    const isStoring = useAppSelector(state => state.documents.isSubmitting);
    const navigate = useNavigate();
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

    useEffect(() => {
        if(!id) {
            return;
        }
        dispatch(loadDocument({ args: id }));
    }, [ id ]);

    useEffect(() => {
        if(!matchedDocument) {
            return;
        }
        setTimestamp(matchedDocument.timestamp);
        setNote(matchedDocument.note);
    }, [ matchedDocument ]);

    const store = async (e: FormEvent) => {
        e.preventDefault();
        if(!file && !matchedDocument) {
            NotificationManager.error(resolveText('Document_NoFileSelected'));
            return;
        }
        if(!profileData) {
            NotificationManager.error(resolveText('PleaseSelect_Patient'));
            return;
        }
        const document = buildDocument();
        dispatch(addDocument({
            args: document,
            body: document,
            onSuccess: async () => {
                try {
                    if(file) {
                        await apiClient.instance!.put(`api/documents/${document.id}/upload`, {}, file, { stringifyBody: false });
                        NotificationManager.success(resolveText('Document_SuccessfullyUploaded'));
                    }
                    navigate(-1);
                } catch(error:any) {
                    NotificationManager.error(error.message, resolveText('Document_CouldNotUpload'));
                }
            }
        }));
    }
    const canStore = () => {
        if(!profileData) {
            return false;
        }
        if(!file && !matchedDocument) {
            return false;
        }
        return true;
    }
    const buildDocument = (): Models.PatientDocument => {
        return {
            id: id ?? uuid(),
            type: HealthRecordEntryType.Document,
            personId: profileData!.id,
            createdBy: user!.accountId,
            timestamp: timestamp,
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === profileData!.id,
            note: note,
            fileName: file?.name ?? matchedDocument!.fileName
        };
    }

    return (
        <>
            <h1>{resolveText('Document')}</h1>
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
                <RowFormGroup
                    label={resolveText('Document_Note')}
                    value={note}
                    onChange={setNote}
                />
                <FormGroup>
                    <FormLabel>{resolveText('Document_Upload')}</FormLabel>
                    {file ? <Alert variant="success" dismissible onClose={() => setFile(undefined)}>{resolveText('SelectedFile')}: <b>{file.name}</b></Alert> : null}
                    <FileUpload
                        onDrop={files => setFile(files[0])}
                    />
                </FormGroup>
                <StoreButton
                    type="submit"
                    isStoring={isStoring}
                    disabled={!canStore()}
                />
            </Form>
        </>
    );

}