import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { NotificationManager} from 'react-notifications';
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
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);

    const [ id, setId ] = useState<string>(matchedId);
    const [ isIdTaken, setIsIdTaken ] = useState<boolean>(false);
    const [ firstName, setFirstName ] = useState<string>('');
    const [ lastName, setLastName ] = useState<string>('');
    const [ birthday, setBirthday ] = useState<Date>();
    const [ roles, setRoles ] = useState<Models.Role[]>([]);

    useEffect(() => {
        const loadRoles = async () => {

        };
        loadRoles();
    }, []);
    useEffect(() => {
        if(isNewEmployee) return;
        if(!roles) return;
        const loadEmployee = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`api/employees/${matchedId}`, {});
                const employee = await response.json() as Models.Employee;
                setId(employee.id);
                setFirstName(employee.firstName);
                setLastName(employee.lastName);
                setBirthday(employee.birthDate);
                setRoles(employee.roles.map(roleId => roles.find(x => x.id === roleId)!));
            } catch(error) {
                NotificationManager.error(error.message, resolveText('Employee_CouldNotLoad'));
            } finally {
                setIsLoading(false);
            }
        } 
        loadEmployee();
    }, [ isNewEmployee, matchedId, roles ]);
    useEffect(() => {
        if(!isNewEmployee) return;
        const checkForExistingEmployee = async () => {
            const response = await apiClient.get(`api/employees/${id}`, {});
            setIsIdTaken(response.ok);
        }
        checkForExistingEmployee();
    }, [ isNewEmployee, id ]);

    const addRole = (role: Models.Role) => {
        if(roles.some(x => x.id === role.id)) {
            return;
        }
        setRoles(roles.concat(role));
    }
    const removeRole = (role: Models.Role) => {
        setRoles(roles.filter(x => x.id !== role.id));
    }

    const store = async (e: FormEvent) => {
        e.preventDefault();
        const employee: Models.Employee = {
            id, 
            firstName, 
            lastName, 
            birthDate: birthday!,
            institutionId: '',
            roles: roles.map(role => role.id),
            departmentIds: [],
            isPasswordChangeRequired: false,
            type: PersonType.Employee,
            permissionModifiers: []
        };
        try {
            setIsStoring(true);
            await apiClient.put(`api/employees/${id}`, {}, employee)
            NotificationManager.success(resolveText('Employee_Stored'));
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
                            isInvalid={isIdTaken}
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
                            value={birthday}
                            onChange={selectedDates => setBirthday(selectedDates.length > 0 ? selectedDates[0]: undefined)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column></FormLabel>
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
                <ListFormControl
                    items={roles}
                    idFunc={role => role.id}
                    displayFunc={role => role.name}
                    removeItem={removeRole}
                />
                <AsyncButton
                    type="submit"
                    activeText={resolveText('Save')}
                    executingText={resolveText('Storing...')}
                    isExecuting={isStoring}
                />
            </Form>
        </>
    );

}