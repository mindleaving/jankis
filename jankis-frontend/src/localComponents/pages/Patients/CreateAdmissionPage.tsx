import React, { FormEvent, useMemo, useState } from 'react';
import { Button, FormCheck, InputGroup } from 'react-bootstrap';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { PatientProfileJumbotron } from '../../components/Patients/PatientProfileJumbotron';
import { Models } from '../../types/models';
import Flatpickr from 'react-flatpickr';
import { v4 as uuid } from 'uuid';
import { NotificationManager } from 'react-notifications';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';

interface CreateAdmissionPageProps {}

export const CreateAdmissionPage = (props: CreateAdmissionPageProps) => {

    const personAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Person>('api/persons/search', 'searchText', 10), []);
    const id = uuid();

    const navigate = useNavigate();
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
        await buildAndStoreObject(
            `api/admissions/${id}`,
            resolveText('Admission_SuccessfullyCreated'),
            resolveText('Admission_CouldNotStore'),
            buildAdmission,
            () => navigate(`/healthrecord/${person!.id}`),
            () => setIsStoring(false)
        );
    }

    const buildAdmission = (): Models.Admission => {
        return {
            id: id,
            personId: person!.id,
            admissionTime: admissionDate!,
            isReadmission: isReadmission,
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
                            <Button onClick={() => navigate('/create/person')}>{resolveText('CreateNew')}</Button>
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