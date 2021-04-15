import React, { FormEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import { AccountType, Sex } from '../../types/enums.d';
import { ViewModels } from '../../types/viewModels';
import UserContext from '../../contexts/UserContext';

interface AccountEditPageParams {
    username?: string;
}
interface AccountEditPageProps extends RouteComponentProps<AccountEditPageParams> {

}

export const AccountEditPage = (props: AccountEditPageProps) => {

    const personAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Person>('api/persons/search', 'searchText', 10), []);
    const roleAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Role>('api/roles/search', 'searchText', 10), []);
    const currentUser = useContext(UserContext);

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    if(!isNew && !props.match.params.username) {
        throw new Error('Invalid link');
    }
    const matchedUsername = props.match.params.username;
    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const history = useHistory();

    const [ username, setUsername ] = useState<string>(matchedUsername ?? '');
    const [ isUsernameTaken, setIsUsernameTaken ] = useState<boolean>(false);
    const [ accountType, setAccountType ] = useState<AccountType>();
    const [ personId, setPersonId ] = useState<string>();
    const [ firstName, setFirstName ] = useState<string>('');
    const [ lastName, setLastName ] = useState<string>('');
    const [ birthDate, setBirthDate ] = useState<Date>();
    const [ sex, setSex ] = useState<Sex>();
    const [ roles, setRoles ] = useState<Models.Role[]>([]);

    useEffect(() => {
        if(isNew) return;
        const loadAccount = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`api/accounts/${matchedUsername}`, {});
                const viewModel = await response.json() as ViewModels.AccountViewModel;
                setUsername(viewModel.username);
                setAccountType(viewModel.accountType);
                setPersonId(viewModel.profileData.id);
                setFirstName(viewModel.profileData.firstName);
                setLastName(viewModel.profileData.lastName);
                setBirthDate(viewModel.profileData.birthDate);
                setSex(viewModel.profileData.sex);
                setRoles(viewModel.roles);
            } catch(error) {
                NotificationManager.error(error.message, resolveText('Account_CouldNotLoad'));
            } finally {
                setIsLoading(false);
            }
        } 
        loadAccount();
    }, [ isNew, matchedUsername ]);
    let isUsernameTakenTimer = useRef<NodeJS.Timer>();
    useEffect(() => {
        if(!isNew) return;
        if(username === '') {
            setIsUsernameTaken(false);
            return;
        }
        const checkForExistingAccount = async () => {
            const response = await apiClient.get(`api/accounts/${username}/exists`, {}, false);
            setIsUsernameTaken(response.ok);
        }
        if(isUsernameTakenTimer.current) {
            clearTimeout(isUsernameTakenTimer.current);
        }
        isUsernameTakenTimer.current = setTimeout(checkForExistingAccount, 500);
    }, [ isNew, username ]);

    const addRole = (role: Models.Role) => {
        if(roles.some(x => x.id === role.id)) {
            return;
        }
        setRoles(roles.concat(role));
    }
    const removeRole = (role: Models.Role) => {
        if(currentUser?.username === username) {
            NotificationManager.error(resolveText('Account_CannotChangeOwnPermissions'), resolveText('Forbidden'));
            return;
        }
        setRoles(roles.filter(x => x.id !== role.id));
    }

    const store = async (e: FormEvent) => {
        e.preventDefault();
        if(!isNew && isUsernameTaken) {
            NotificationManager.error(resolveText('Account_UsernameTaken'));
            return;
        }
        try {
            setIsStoring(true);
            const employee: Models.Person = {
                id: personId!, 
                firstName, 
                lastName, 
                birthDate: birthDate!,
                sex: sex!
            };
            await apiClient.put(`api/persons/${personId}`, {}, employee);
            if(isNew) {
                const accountCreationInfo: ViewModels.AccountCreationInfo = {
                    accountType: accountType!,
                    personId: personId!,
                    username: username
                }
                await apiClient.post('api/accounts', {}, accountCreationInfo);
            }
            await apiClient.put(`api/accounts/${username}/roles`, {}, roles.map(x => x.id));
            NotificationManager.success(resolveText('Account_SuccessfullyStored'));
            history.push('/accounts');
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Account_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }

    return (
        <>
            <h1>{isLoading ? resolveText('Loading...') : `${firstName} ${lastName}`}</h1>
            <Form onSubmit={store}>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Username')}</FormLabel>
                    <Col>
                        <FormControl required
                            type="text"
                            value={username}
                            onChange={(e:any) => setUsername(e.target.value)}
                            disabled={!isNew}
                            isInvalid={isNew && username !== '' && isUsernameTaken}
                        />
                        <FormControl.Feedback type="invalid">{resolveText('Account_UsernameTaken')}</FormControl.Feedback>
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Account_AccountType')}</FormLabel>
                    <Col>
                        <FormControl
                            as="select"
                            value={accountType ?? ''}
                            onChange={(e:any) => setAccountType(e.target.value)}
                            disabled={!isNew}
                        >
                            <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                            {Object.keys(AccountType).map(x => (
                                <option value={x} key={x}>{resolveText(`AccountType_${x}`)}</option>
                            ))}
                        </FormControl>
                    </Col>
                </FormGroup>
                {isNew 
                ? <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Account_Person')}</FormLabel>
                    <Col>
                        <Autocomplete
                            search={personAutoCompleteRunner.search}
                            displayNameSelector={x => `${x.firstName} ${x.lastName} (${x.birthDate.toString()})`}
                            onItemSelected={person => {
                                setPersonId(person.id);
                                setFirstName(person.firstName);
                                setLastName(person.lastName);
                                setBirthDate(person.birthDate);
                                setSex(person.sex);
                            }}
                        />
                    </Col>
                </FormGroup>
                : null}
                <RowFormGroup required
                    label={resolveText('FirstName')}
                    type="text"
                    value={firstName}
                    onChange={setFirstName}
                    disabled={isNew && !personId}
                />
                <RowFormGroup required
                    label={resolveText('LastName')}
                    type="text"
                    value={lastName}
                    onChange={setLastName}
                    disabled={isNew && !personId}
                />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Birthday')}</FormLabel>
                    <Col>
                        <Flatpickr required
                            options={{
                                allowInput: true
                            }}
                            value={birthDate}
                            onChange={selectedDates => setBirthDate(selectedDates.length > 0 ? selectedDates[0]: undefined)}
                            disabled={isNew && !personId}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Person_Gender')}</FormLabel>
                    <Col>
                        <FormControl
                            as="select"
                            value={sex ?? ''}
                            onChange={(e:any) => setSex(e.target.value)}
                            disabled={isNew && !personId}
                        >
                            <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                            {Object.keys(Sex).map(x => (
                                <option value={x} key={x}>{resolveText(`Sex_${x}`)}</option>
                            ))}
                        </FormControl>
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Account_Roles')}</FormLabel>
                    <Col>
                        <Autocomplete
                            search={roleAutoCompleteRunner.search}
                            displayNameSelector={role => role.name}
                            onItemSelected={addRole}
                            placeholder={resolveText('Search...')}
                            minSearchTextLength={3}
                            resetOnSelect
                            disabled={currentUser?.username === username}
                        />
                    </Col>
                </FormGroup>
                <Row>
                    <Col></Col>
                    <Col>
                        <ListFormControl<Models.Role>
                            items={roles}
                            idFunc={role => role.id}
                            displayFunc={role => role.name}
                            removeItem={removeRole}
                        />
                    </Col>
                </Row>
                <AsyncButton
                    type="submit"
                    activeText={resolveText('Save')}
                    executingText={resolveText('Storing...')}
                    isExecuting={isStoring}
                    disabled={isUsernameTaken}
                />
            </Form>
        </>
    );

}