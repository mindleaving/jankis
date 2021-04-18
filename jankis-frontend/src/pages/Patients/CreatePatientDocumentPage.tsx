import { FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { PatientEventType } from '../../types/enums.d';
import { PatientParams } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import UserContext from '../../contexts/UserContext';
import { StoreButton } from '../../components/StoreButton';
import { RowFormGroup } from '../../components/RowFormGroup';
import { FileUpload } from '../../components/FileUpload';
import { formatAdmission } from '../../helpers/Formatters';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../communication/ApiClient';
import { PatientAutocomplete } from '../../components/PatientAutocomplete';

interface CreatePatientDocumentPageProps extends RouteComponentProps<PatientParams> {}

export const CreatePatientDocumentPage = (props: CreatePatientDocumentPageProps) => {

    const matchedPatientId = props.match.params.patientId;
    const user = useContext(UserContext);

    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const [ admissionId, setAdmissionId ] = useState<string>();
    const [ note, setNote ] = useState<string>('');
    const [ file, setFile ] = useState<File>();
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
            await apiClient.put(`api/documents/${id}`, {}, document);
            await apiClient.put(`api/documents/${id}/upload`, {}, file, { stringifyBody: false });
            NotificationManager.success(resolveText('Patient_Document_SuccessfullyStored'));
            history.goBack();
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Patient_Document_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }
    const buildDocument = (): Models.PatientDocument => {
        return {
            id: id,
            type: PatientEventType.Document,
            patientId: profileData!.id,
            admissionId: admissionId,
            createdBy: user!.username,
            timestamp: new Date(),
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
                />
            </Form>
        </>
    );

}