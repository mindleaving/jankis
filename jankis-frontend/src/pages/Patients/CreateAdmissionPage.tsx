import React, { FormEvent, useMemo, useState } from 'react';
import { Button, FormCheck, InputGroup } from 'react-bootstrap';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Autocomplete } from '../../components/Autocomplete';
import { PatientProfileJumbotron } from '../../components/Patients/PatientProfileJumbotron';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import Flatpickr from 'react-flatpickr';
import { AsyncButton } from '../../components/AsyncButton';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { v4 as uuid } from 'uuid';
import { NotificationManager } from 'react-notifications';

interface CreateAdmissionPageProps {}

export const CreateAdmissionPage = (props: CreateAdmissionPageProps) => {

    const personAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Person>('api/persons/search', 'searchText', 10), []);
    const id = uuid();

    const history = useHistory();
    const [ person, setPerson ] = useState<Models.Person>();
    const [ admissionDate, setAdmissionDate ] = useState<Date>();
    const [ isReadmission, setIsReadmission ] = useState<boolean>(false);
    const [ contactPersons, setContactPersons ] = useState<Models.Contact[]>([]);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);

    const createAdmission = async (e: FormEvent) => {
        e.preventDefault();
        if(!person) {
            NotificationManager.error(resolveText('PleaseSelect_Patient'));
            return;
        }
        setIsStoring(true);
        await buidlAndStoreObject(
            `api/admissions/${id}`,
            resolveText('Admission_SuccessfullyCreated'),
            resolveText('Admission_CouldNotStore'),
            buildAdmission,
            () => history.push(`/patients/${person!.id}`),
            () => setIsStoring(false)
        );
    }

    const buildAdmission = (): Models.Admission => {
        return {
            id: id,
            admissionTime: admissionDate!,
            isReadmission: isReadmission,
            patientId: person!.id,
            profileData: person!,
            contactPersons: contactPersons
        };
    }

    return (
        <>
            <h1>{resolveText('Admission_Create')}</h1>
            <Form onSubmit={createAdmission}>
                <h3>{resolveText('Patient_PersonalInformation')}</h3>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Search')}</FormLabel>
                    <Col>
                        <InputGroup>
                            <Autocomplete
                                search={personAutocompleteRunner.search}
                                displayNameSelector={x => `${x.firstName} ${x.lastName} (${x.birthDate.toLocaleDateString()})`}
                                onItemSelected={setPerson}
                            />
                            <Button onClick={() => history.push('/create/person')}>{resolveText('CreateNew')}</Button>
                        </InputGroup>
                    </Col>
                </FormGroup>
                {person ? 
                <Row>
                    <Col></Col>
                    <Col>
                        <PatientProfileJumbotron
                            profileData={person}
                        />
                    </Col>
                </Row> : null}
                <hr />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Admission_IsReadmission')}</FormLabel>
                    <Col>
                        <FormCheck
                            checked={isReadmission}
                            onChange={(e:any) => setIsReadmission(e.target.checked)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Admission_AdmissionDate')}</FormLabel>
                    <Col>
                        <Flatpickr
                            value={admissionDate}
                            onChange={selectedDates => setAdmissionDate(selectedDates[0])}
                            options={{
                                allowInput: true
                            }}
                        />
                    </Col>
                </FormGroup>
                <AsyncButton
                    type="submit"
                    activeText={resolveText('Admit')}
                    executingText={resolveText('Admitting...')}
                    isExecuting={isStoring}
                />
            </Form>
        </>
    );

}