import { FormEvent, useContext, useEffect, useMemo, useState } from 'react';
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

interface CreatePatientDocumentPageProps {}

export const CreatePatientDocumentPage = (props: CreatePatientDocumentPageProps) => {

    const { personId } = useParams();
    const user = useContext(UserContext);

    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ note, setNote ] = useState<string>('');
    const [ file, setFile ] = useState<File>();
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const navigate = useNavigate();
    const documentId = useMemo(() => uuid(), []);

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
        if(!file) {
            NotificationManager.error(resolveText('Document_NoFileSelected'));
            return;
        }
        if(!profileData) {
            NotificationManager.error(resolveText('PleaseSelect_Patient'));
            return;
        }
        setIsStoring(true);
        try {
            const document = buildDocument();
            await apiClient.instance!.put(`api/documents/${documentId}`, {}, document);
            await apiClient.instance!.put(`api/documents/${documentId}/upload`, {}, file, { stringifyBody: false });
            NotificationManager.success(resolveText('Patient_Document_SuccessfullyStored'));
            navigate(-1);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('Patient_Document_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }
    const buildDocument = (): Models.PatientDocument => {
        return {
            id: documentId,
            type: HealthRecordEntryType.Document,
            personId: profileData!.id,
            createdBy: user!.username,
            timestamp: new Date(),
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === profileData!.id,
            note: note,
            fileName: file!.name
        };
    }

    return (
        <>
            <h1>{resolveText('Patient_Document')}</h1>
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
                    label={resolveText('Patient_Document_Note')}
                    value={note}
                    onChange={setNote}
                />
                <FormGroup>
                    <FormLabel>{resolveText('Patient_Document_Upload')}</FormLabel>
                    {file ? <Alert variant="success" dismissible onClose={() => setFile(undefined)}>{resolveText('SelectedFile')}: <b>{file.name}</b></Alert> : null}
                    <FileUpload
                        onDrop={files => setFile(files[0])}
                    />
                </FormGroup>
                <StoreButton
                    type="submit"
                    isStoring={isStoring}
                    disabled={!profileData || !file}
                />
            </Form>
        </>
    );

}