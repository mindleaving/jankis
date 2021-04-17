import React, { FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { Autocomplete } from '../../components/Autocomplete';
import { StoreButton } from '../../components/StoreButton';
import UserContext from '../../contexts/UserContext';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { formatAdmission, formatPerson } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { PatientEventType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid} from 'uuid';
import { PatientParams } from '../../types/frontendTypes';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';

interface CreatePatientNotePageProps extends RouteComponentProps<PatientParams> {}

export const CreatePatientNotePage = (props: CreatePatientNotePageProps) => {

    const matchedPatientId = props.match.params.patientId;
    const patientAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Person>('api/persons/search', 'searchText', 10), []);
    const user = useContext(UserContext);

    const [ patientId, setPatientId ] = useState<string | undefined>(matchedPatientId);
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const [ admissionId, setAdmissionId ] = useState<string>();
    const [ message, setMessage ] = useState<string>('');
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const history = useHistory();
    const id = uuid();

    useEffect(() => {
        if(!patientId) return;
        const loadProfileData = buildLoadObjectFunc<Models.Person>(
            `api/persons/${patientId}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            setProfileData
        );
        loadProfileData();
        const loadAdmissions = buildLoadObjectFunc<Models.Admission[]>(
            `api/patients/${patientId}/admissions`,
            {},
            resolveText('Admissions_CouldNotLoad'),
            setAdmissions
        );
        loadAdmissions();
    }, [ patientId ]);

    const store = async (e: FormEvent) => {
        e.preventDefault();
        if(!patientId) {
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
            patientId: patientId!,
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
                        {matchedPatientId
                        ? <Alert variant="info">{profileData ? formatPerson(profileData) : resolveText('Loading...')}</Alert>
                        : <Autocomplete
                            search={patientAutocompleteRunner.search}
                            displayNameSelector={formatPerson}
                            onItemSelected={person => setPatientId(person.id)}
                        />}
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
                    <FormControl
                        as="textarea"
                        value={message}
                        onChange={(e:any) => setMessage(e.target.value)}
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