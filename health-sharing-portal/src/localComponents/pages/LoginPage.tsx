import { FormEvent, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { ViewModels } from '../types/viewModels';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { Models } from '../types/models';
import { ApiError } from '../../sharedCommonComponents/communication/ApiError';

interface LoginPageProps {
    onNewAccessToken: (authenticationResult: Models.AuthenticationResult) => void;
    onLoggedIn: (userViewModel: ViewModels.IUserViewModel | null, redirectUrl?: string) => void;
}

export const LoginPage = (props: LoginPageProps) => {

    const { accountType } = useParams();
    const [ query ] = useSearchParams();
    let redirectUrl = query.get("redirectUrl");
    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [ isLoggingIn, setIsLoggingIn ] = useState<boolean>(false);

    const localLogin = async (e?: FormEvent) => {
        e?.preventDefault();
        try {
            setIsLoggingIn(true);
            const loginResponse = await apiClient.instance!.post(
                `api/accounts/${username}/login?accountType=${accountType}`, {}, 
                `"${password}"`, 
                { handleError: false});
            if(loginResponse.status === 401) {
                const authenticationResult = await loginResponse.json() as Models.AuthenticationResult;
                throw new ApiError(loginResponse.status, resolveText(`AuthenticationErrorType_${authenticationResult.error}`));
            }
            if(!loginResponse.ok) {
                throw new ApiError(loginResponse.status, '');
            }
            const authenticationResult = await loginResponse.json() as Models.AuthenticationResult;
            props.onNewAccessToken(authenticationResult);
            const userViewModelResponse = await apiClient.instance!.get('api/viewmodels/currentuser', {}, { handleError: false });
            if(userViewModelResponse.status === 404) {
                redirectUrl = `/register/${accountType}`;
                props.onLoggedIn(null, redirectUrl ?? undefined);
            } else {
                const userViewModel = await userViewModelResponse.json() as ViewModels.IUserViewModel;
                if(!userViewModel.accountId || !userViewModel.profileData) {
                    redirectUrl = `/register/${accountType}`;
                }
                props.onLoggedIn(userViewModel, redirectUrl ?? undefined);
            }
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('Login_CouldNotLogIn'));
        } finally {
            setIsLoggingIn(false);
        }
    }

    const navigate = useNavigate();
    return (
        <>
            <Form onSubmit={localLogin}>
                <Row style={{ marginTop: '200px' }}>
                    <Col>
                        <h1>{resolveText('HealthSharingPortal')}</h1>
                    </Col>
                </Row>
                <FormGroup as={Row} className="my-2">
                    <FormLabel column>{resolveText('Username')}</FormLabel>
                    <Col>
                        <FormControl required
                            value={username}
                            onChange={(e:any) => setUsername(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className="my-2">
                    <FormLabel column>{resolveText('Password')}</FormLabel>
                    <Col>
                        <FormControl required
                            type="password"
                            value={password}
                            onChange={(e:any) => setPassword(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <Row>
                    <Col>
                        <AsyncButton
                            type="submit"
                            activeText={resolveText('Login')}
                            executingText={resolveText('LoggingIn...')}
                            isExecuting={isLoggingIn}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <hr />
                    </Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col xs="auto">
                        <Button className='registerButton' onClick={() => navigate(`/register/${accountType}`)}>{resolveText("Register")}</Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Form>
        </>
    );

}