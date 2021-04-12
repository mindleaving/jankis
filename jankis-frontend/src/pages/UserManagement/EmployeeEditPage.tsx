import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../communication/ApiClient';
import { Col, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { RowFormGroup } from '../../components/RowFormGroup';
import { ListFormControl } from '../../components/ListFormControl';
import { Autocomplete } from '../../components/Autocomplete';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import Flatpickr from 'react-flatpickr';
import { AsyncButton } from '../../components/AsyncButton';
import { PersonType } from '../../types/enums.d';

interface EmployeeEditPageParams {
    employeeId?: string;
}
interface EmployeeEditPageProps extends RouteComponentProps<EmployeeEditPageParams> {

}

export const EmployeeEditPage = (props: EmployeeEditPageProps) => {

    const roleAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Role>('api/roles/search', 'searchText', 10), []);

    const isNewEmployee = props.match.path.toLowerCase().startsWith('/create');
    const matchedId = props.match.params.employeeId ?? '';
    const [ isLoading, setIsLoading ] = useState<boolean>(!isNewEmployee);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const history = useHistory();

    const [ id, setId ] = useState<string>(matchedId);
    const [ isIdTaken, setIsIdTaken ] = useState<boolean>(false);
    const [ firstName, setFirstName ] = useState<string>('');
    const [ lastName, setLastName ] = useState<string>('');
    const [ birthday, setBirthday ] = useState<Date>();
    const [ roles, setRoles ] = useState<string[]>([]);

    useEffect(() => {
        if(isNewEmployee) return;
        const loadEmployee = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`api/employees/${matchedId}`, {});
                const employee = await response.json() as Models.Employee;
                setId(employee.id);
                setFirstName(employee.firstName);
                setLastName(employee.lastName);
                setBirthday(employee.birthDate);
                setRoles(employee.roles);
            } catch(error) {
                NotificationManager.error(error.message, resolveText('Employee_CouldNotLoad'));
            } finally {
                setIsLoading(false);
            }
        } 
        loadEmployee();
    }, [ isNewEmployee, matchedId ]);
    let isIdTakenTimer = useRef<NodeJS.Timer>();
    useEffect(() => {
        if(!isNewEmployee) return;
        if(id === '') {
            setIsIdTaken(false);
            return;
        }
        const checkForExistingEmployee = async () => {
            const response = await apiClient.get(`api/employees/${id}/exists`, {}, false);
            setIsIdTaken(response.ok);
        }
        if(isIdTakenTimer.current) {
            clearTimeout(isIdTakenTimer.current);
        }
        isIdTakenTimer.current = setTimeout(checkForExistingEmployee, 500);
    }, [ isNewEmployee, id ]);

    const addRole = (role: Models.Role) => {
        if(roles.some(x => x === role.id)) {
            return;
        }
        setRoles(roles.concat(role.id));
    }
    const removeRole = (role: string) => {
        setRoles(roles.filter(x => x !== role));
    }

    const store = async (e: FormEvent) => {
        e.preventDefault();
        if(!isNewEmployee && isIdTaken) {
            NotificationManager.error(resolveText('Employee_IDTaken'));
            return;
        }
        const employee: Models.Employee = {
            id, 
            firstName, 
            lastName, 
            birthDate: birthday!,
            institutionId: '',
            roles: roles,
            departmentIds: [],
            isPasswordChangeRequired: false,
            type: PersonType.Employee,
            permissionModifiers: []
        };
        try {
            setIsStoring(true);
            await apiClient.put(`api/employees/${id}`, {}, employee)
            NotificationManager.success(resolveText('Employee_Stored'));
            history.push('/employees');
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Employee_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }

    return (
        <>
            <h1>{isLoading ? resolveText('Loading...') : `${firstName} ${lastName}`}</h1>
            <Form className="needs-validation was-validated" onSubmit={store}>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('ID')}</FormLabel>
                    <Col>
                        <FormControl required
                            type="text"
                            value={id}
                            onChange={(e:any) => setId(e.target.value)}
                            disabled={!isNewEmployee}
                            isInvalid={isNewEmployee && id !== '' && isIdTaken}
                        />
                        <FormControl.Feedback type="invalid">{resolveText('Employee_IDTaken')}</FormControl.Feedback>
                    </Col>
                </FormGroup>
                <RowFormGroup required
                    label={resolveText('FirstName')}
                    type="text"
                    value={firstName}
                    onChange={setFirstName}
                />
                <RowFormGroup required
                    label={resolveText('LastName')}
                    type="text"
                    value={lastName}
                    onChange={setLastName}
                />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Birthday')}</FormLabel>
                    <Col>
                        <Flatpickr required
                            options={{
                                allowInput: true
                            }}
                            value={birthday}
                            onChange={selectedDates => setBirthday(selectedDates.length > 0 ? selectedDates[0]: undefined)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Employee_Roles')}</FormLabel>
                    <Col>
                        <Autocomplete
                            search={roleAutoCompleteRunner.search}
                            displayNameSelector={role => role.name}
                            onItemSelected={addRole}
                            placeholder={resolveText('Search...')}
                            minSearchTextLength={3}
                            resetOnSelect
                        />
                    </Col>
                </FormGroup>
                <Row>
                    <Col></Col>
                    <Col>
                        <ListFormControl<string>
                            items={roles}
                            idFunc={role => role}
                            displayFunc={role => role}
                            removeItem={removeRole}
                        />
                    </Col>
                </Row>
                <AsyncButton
                    type="submit"
                    activeText={resolveText('Save')}
                    executingText={resolveText('Storing...')}
                    isExecuting={isStoring}
                    disabled={isIdTaken}
                />
            </Form>
        </>
    );

}