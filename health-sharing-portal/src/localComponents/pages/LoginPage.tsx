import React, { FormEvent, useState } from 'react';
import { Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { NotificationManager, NotificationContainer } from 'react-notifications';
import { ViewModels } from '../types/viewModels';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';

interface LoginPageProps {
    onLoggedIn: (userViewModel: ViewModels.LoggedInUserViewModel) => void;
}

export const LoginPage = (props: LoginPageProps) => {

    const { role } = useParams();
    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [ isLoggingIn, setIsLoggingIn ] = useState<boolean>(false);

    const login = async (e?: FormEvent) => {
        e?.preventDefault();
        try {
            setIsLoggingIn(true);
            const response = await apiClient.instance!.post(`api/accounts/${username}/login`, {}, `"${password}"`);
            const userViewModel = await response.json() as ViewModels.LoggedInUserViewModel;
            props.onLoggedIn(userViewModel);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('Login_CouldNotLogIn'));
        } finally {
            setIsLoggingIn(false);
        }
    }

    const navigate = useNavigate();
    return (
        <>
            <NotificationContainer />
            <Form onSubmit={login}>
            <Container>
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
                        <Button className='registerButton' onClick={() => navigate(`/register/${role}`)}>{resolveText("Register")}</Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
            </Form>
        </>
    );

}