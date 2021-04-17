import React, { FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { PatientEventType } from '../../types/enums.d';
import { PatientParams } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import UserContext from '../../contexts/UserContext';
import { StoreButton } from '../../components/StoreButton';
import { RowFormGroup } from '../../components/RowFormGroup';
import { FileUpload } from '../../components/FileUpload';
import { Autocomplete } from '../../components/Autocomplete';
import { formatPerson, formatAdmission } from '../../helpers/Formatters';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';

interface CreatePatientDocumentPageProps extends RouteComponentProps<PatientParams> {}

export const CreatePatientDocumentPage = (props: CreatePatientDocumentPageProps) => {

    const matchedPatientId = props.match.params.patientId;
    const patientAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Person>('api/persons/search', 'searchText', 10), []);
    const user = useContext(UserContext);

    const [ patientId, setPatientId ] = useState<string | undefined>(matchedPatientId);
    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const [ admissionId, setAdmissionId ] = useState<string>();
    const [ note, setNote ] = useState<string>('');
    const [ file, setFile ] = useState<File>();
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        if(!patientId) return;
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
        setIsStoring(true);
        await buidlAndStoreObject<Models.PatientDocument>(
            `api/patients/${patientId}/documents`,
            resolveText('Patient_Document_SuccessfullyStored'),
            resolveText('Patient_Document_CouldNotStore'),
            buildDocument,
            () => history.goBack(),
            () => setIsStoring(false)
        );
    }
    const buildDocument = (): Models.PatientDocument => {
        return {
            id: uuid(),
            type: PatientEventType.Document,
            patientId: patientId!,
            admissionId: admissionId,
            createdBy: user!.username,
            timestamp: new Date(),
            note: note
        };
    }

    return (
        <>
            <h1>{resolveText('Patient_Document')}</h1>
            <Form onSubmit={store}>
            <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Patient')}</FormLabel>
                    <Col>
                        <Autocomplete
                            search={patientAutocompleteRunner.search}
                            displayNameSelector={formatPerson}
                            onItemSelected={person => setPatientId(person.id)}
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