import React, { FormEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { Col, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';
import { AccountType, Sex } from '../../types/enums.d';
import { ViewModels } from '../../types/viewModels';
import UserContext from '../../contexts/UserContext';
import { v4 as uuid} from 'uuid';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface AccountEditPageParams {
    username?: string;
}
interface AccountEditPageProps {
}

export const AccountEditPage = (props: AccountEditPageProps) => {

    const location = useLocation();
    const params: AccountEditPageParams = useParams();
    const personAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Person>('api/persons/search', 'searchText', 10), []);
    const currentUser = useContext(UserContext);
    const matchedUsername = params.username ?? currentUser?.username;

    const isNew = location.pathname.toLowerCase().startsWith('/create');
    if(!isNew && !matchedUsername) {
        throw new Error('Invalid link');
    }
    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const navigate = useNavigate();

    const [ username, setUsername ] = useState<string>(matchedUsername ?? '');
    const [ isUsernameTaken, setIsUsernameTaken ] = useState<boolean>(false);
    const [ accountType, setAccountType ] = useState<AccountType>();
    const [ personId, setPersonId ] = useState<string>();
    const [ firstName, setFirstName ] = useState<string>('');
    const [ lastName, setLastName ] = useState<string>('');
    const [ birthDate, setBirthDate ] = useState<Date>();
    const [ sex, setSex ] = useState<Sex>();

    useEffect(() => {
        if(isNew) return;
        const loadAccount = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.instance!.get(`api/accounts/${matchedUsername}`, {});
                const viewModel = await response.json() as ViewModels.AccountViewModel;
                setUsername(viewModel.username);
                setAccountType(viewModel.accountType);
                setPersonId(viewModel.profileData.id);
                setFirstName(viewModel.profileData.firstName);
                setLastName(viewModel.profileData.lastName);
                setBirthDate(viewModel.profileData.birthDate);
                setSex(viewModel.profileData.sex);
            } catch(error: any) {
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
            const response = await apiClient.instance!.get(`api/accounts/${username}/exists`, {}, { handleError: false });
            setIsUsernameTaken(response.ok);
        }
        if(isUsernameTakenTimer.current) {
            clearTimeout(isUsernameTakenTimer.current);
        }
        isUsernameTakenTimer.current = setTimeout(checkForExistingAccount, 500);
    }, [ isNew, username ]);


    const store = async (e: FormEvent) => {
        e.preventDefault();
        if(!isNew && isUsernameTaken) {
            NotificationManager.error(resolveText('Account_UsernameTaken'));
            return;
        }
        try {
            setIsStoring(true);
            if(isNew) {
                const id = personId ?? uuid();
                const person: Models.Person = {
                    id: id, 
                    personId: id,
                    firstName, 
                    lastName, 
                    birthDate: birthDate!,
                    sex: sex!,
                    addresses: []
                };
                await apiClient.instance!.put(`api/persons/${person.id}`, {}, person);
                const accountCreationInfo: ViewModels.AccountCreationInfo = {
                    accountType: accountType!,
                    personId: person.id,
                    username: username
                }
                await apiClient.instance!.post('api/accounts', {}, accountCreationInfo);
            }
            NotificationManager.success(resolveText('Account_SuccessfullyStored'));
            navigate(-1);
        } catch(error: any) {
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
                    <FormLabel column xs="5">{resolveText('Username')}</FormLabel>
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
                    <FormLabel column xs="5">{resolveText('Account_AccountType')}</FormLabel>
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
                    <FormLabel column xs="5">{resolveText('Account_Person')}</FormLabel>
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
                <FormGroup as={Row}>
                    <FormLabel column xs="5">{resolveText('FirstName')}</FormLabel>
                    <Col>
                        <FormControl
                            value={firstName}
                            onChange={(e:any) => setFirstName(e.target.value)}
                            disabled={!isNew || personId !== undefined}
                        />
                    </Col>
                    {!isNew 
                    ? <Col xs="auto">
                        <i className="fa fa-edit clickable" onClick={() => navigate(`/persons/${personId}/edit`)}/>
                    </Col>: null}
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column xs="5">{resolveText('LastName')}</FormLabel>
                    <Col>
                        <FormControl
                            value={lastName}
                            onChange={(e:any) => setLastName(e.target.value)}
                            disabled={!isNew || personId !== undefined}
                        />
                    </Col>
                    {!isNew 
                    ? <Col xs="auto">
                        <i className="fa fa-edit clickable" onClick={() => navigate(`/persons/${personId}/edit`)}/>
                    </Col>: null}
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column xs="5">{resolveText('Birthday')}</FormLabel>
                    <Col>
                        <Flatpickr required
                            options={{
                                allowInput: true
                            }}
                            value={birthDate}
                            onChange={selectedDates => setBirthDate(selectedDates.length > 0 ? selectedDates[0]: undefined)}
                            disabled={!isNew || personId !== undefined}
                        />
                    </Col>
                    {!isNew 
                    ? <Col xs="auto">
                        <i className="fa fa-edit clickable" onClick={() => navigate(`/persons/${personId}/edit`)}/>
                    </Col>: null}
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column xs="5">{resolveText('Person_Gender')}</FormLabel>
                    <Col>
                        <FormControl
                            as="select"
                            value={sex ?? ''}
                            onChange={(e:any) => setSex(e.target.value)}
                            disabled={!isNew || personId !== undefined}
                        >
                            <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                            {Object.keys(Sex).map(x => (
                                <option value={x} key={x}>{resolveText(`Sex_${x}`)}</option>
                            ))}
                        </FormControl>
                    </Col>
                    {!isNew 
                    ? <Col xs="auto">
                        <i className="fa fa-edit clickable" onClick={() => navigate(`/persons/${personId}/edit`)}/>
                    </Col>: null}
                </FormGroup>
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