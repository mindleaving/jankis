import React, { FormEvent, useEffect, useState } from 'react';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { v4 as uuid } from 'uuid';
import { AsyncButton } from '../../components/AsyncButton';
import { RowFormGroup } from '../../components/RowFormGroup';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { Sex } from '../../types/enums.d';
import { Models } from '../../types/models';
import Flatpickr from 'react-flatpickr';
import { PatientParams } from '../../types/frontendTypes';

interface CreateEditPatientPageProps extends RouteComponentProps<PatientParams> {}

export const CreateEditPatientPage = (props: CreateEditPatientPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    if(!isNew && !props.match.params.patientId) {
        throw new Error('Invalid link');
    }
    const id = props.match.params.patientId ?? uuid();

    const [ firstName, setFirstName ] = useState<string>('');
    const [ lastName, setLastName ] = useState<string>('');
    const [ birthday, setBirthday ] = useState<Date>();
    const [ sex, setSex ] = useState<Sex>();
    const [ insurerName, setInsurerName ] = useState<string>('');
    const [ insurerNumber, setInsurerNumber ] = useState<string>('');
    const [ insuranceNumber, setInsuranceNumber ] = useState<string>('');
    const history = useHistory();
    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadPatient = buildLoadObjectFunc<Models.Person>(
            `api/persons/${id}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            patient => {
                setFirstName(patient.firstName);
                setLastName(patient.lastName);
                setBirthday(patient.birthDate);
                setSex(patient.sex);
                if(patient.healthInsurance) {
                    setInsurerName(patient.healthInsurance.insurerName);
                    setInsurerNumber(patient.healthInsurance.insurerNumber);
                    setInsuranceNumber(patient.healthInsurance.insuranceNumber);
                }
            },
            () => setIsLoading(false)
        );
        loadPatient();
    }, [ isNew, id ]);

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        setIsStoring(true);
        await buidlAndStoreObject(
            `api/persons/${id}`,
            resolveText('Patient_SuccessfullyStored'),
            resolveText('Patient_CouldNotStore'),
            buildPatient,
            () => history.goBack(),
            () => setIsStoring(false)
        );
    }
    const buildPatient = (): Models.Person => {
        return {
            id,
            firstName,
            lastName,
            birthDate: birthday!,
            sex: sex!,
            healthInsurance: {
                insurerName: insurerName,
                insurerNumber: insurerNumber,
                insuranceNumber: insuranceNumber
            }
        }
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <h1>{resolveText('Patient_Create')}</h1>
            <Form onSubmit={store}>
                <h3>{resolveText('Patient_PersonalInformation')}</h3>
                <RowFormGroup required
                    label={resolveText('Person_FirstName')}
                    value={firstName}
                    onChange={setFirstName}
                />
                <RowFormGroup required
                    label={resolveText('Person_LastName')}
                    value={lastName}
                    onChange={setLastName}
                />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Patient_Birthday')}</FormLabel>
                    <Col>
                        <Flatpickr required
                            value={birthday}
                            onChange={selectedDates => setBirthday(selectedDates.length > 0 ? selectedDates[0]: undefined)}
                            options={{
                                allowInput: true
                            }}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Person_Gender')}</FormLabel>
                    <Col>
                        <FormControl required
                            as="select"
                            value={sex ?? ''}
                            onChange={(e:any) => setSex(e.target.value)}
                        >
                            <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                            {Object.keys(Sex).map(x => (
                                <option value={x} key={x}>{resolveText(`Sex_${x}`)}</option>
                            ))}
                        </FormControl>
                    </Col>
                </FormGroup>
                <hr />
                <h3>{resolveText('HealthInsurance')}</h3>
                <RowFormGroup required
                    label={resolveText('Insurance_InsurerName')}
                    value={insurerName}
                    onChange={setInsurerName}
                />
                <RowFormGroup required
                    label={resolveText('Insurance_InsurerNumber')}
                    value={insurerNumber}
                    onChange={setInsurerNumber}
                />
                <RowFormGroup required
                    label={resolveText('Insurance_InsuranceNumber')}
                    value={insuranceNumber}
                    onChange={setInsuranceNumber}
                />
                <AsyncButton
                    type="submit"
                    activeText={resolveText('Store')}
                    executingText={resolveText('Storing...')}
                    isExecuting={isStoring}
                />
            </Form>
        </>
    );

}