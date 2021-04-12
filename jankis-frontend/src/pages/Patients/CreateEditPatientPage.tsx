import React, { FormEvent, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { v4 as uuid } from 'uuid';
import { AsyncButton } from '../../components/AsyncButton';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { PersonType } from '../../types/enums';
import { Models } from '../../types/models';

interface PatientParams {
    patientId?: string;
}
interface CreateEditPatientPageProps extends RouteComponentProps<PatientParams> {}

export const CreateEditPatientPage = (props: CreateEditPatientPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    const id = props.match.params.patientId ?? uuid();
    const [ firstName, setFirstName ] = useState<string>('');
    const [ lastName, setLastName ] = useState<string>('');
    const [ birthday, setBirthday ] = useState<Date>();
    const history = useHistory();
    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadPatient = buildLoadObjectFunc<Models.Patient>(
            `api/patients/${id}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            patient => {
                setFirstName(patient.firstName);
                setLastName(patient.lastName);
                setBirthday(patient.birthDate);
            },
            () => setIsLoading(false)
        );
        loadPatient();
    }, [ isNew, id ]);

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        setIsStoring(true);
        await buidlAndStoreObject(
            `api/patients/${id}`,
            resolveText('Patient_SuccessfullyStored'),
            resolveText('Patient_CouldNotStore'),
            buildPatient,
            () => history.push(`/patients/${id}`),
            () => setIsStoring(false)
        );
    }
    const buildPatient = (): Models.Patient => {
        return {
            id,
            firstName,
            lastName,
            birthDate: birthday!,
            type: PersonType.Patient,
            healthInsurance: {

            },
            isPasswordChangeRequired: true,
            roles: [ "Patient" ],
            permissionModifiers: []
        }
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <h1>{resolveText('Patient_Create')}</h1>
            <Form onSubmit={store}>
                <AsyncButton
                    activeText={resolveText('Store')}
                    executingText={resolveText('Storing...')}
                    isExecuting={isStoring}
                />
            </Form>
        </>
    );

}