import React, { FormEvent, useState } from 'react';
import { Col, Container, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { AsyncButton } from '../components/AsyncButton';
import { resolveText } from '../helpers/Globalizer';
import { NotificationManager, NotificationContainer } from 'react-notifications';
import { Models } from '../types/models';
import { apiClient } from '../communication/ApiClient';

interface LoginPageProps {
    onLoggedIn: (authenticationResult: Models.AuthenticationResult) => void;
}

export const LoginPage = (props: LoginPageProps) => {

    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [ isLoggingIn, setIsLoggingIn ] = useState<boolean>(false);

    const login = async (e?: FormEvent) => {
        e?.preventDefault();
        try {
            setIsLoggingIn(true);
            const response = await apiClient.post(`api/employees/${username}/login`, {}, `"${password}"`);
            const authenticationResult = await response.json() as Models.AuthenticationResult;
            props.onLoggedIn(authenticationResult);
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Login_CouldNotLogIn'));
        } finally {
            setIsLoggingIn(false);
        }
    }

    return (
        <>
            <NotificationContainer />
            <Form onSubmit={login}>
            <Container>
                <Row style={{ marginTop: '200px' }}>
                    <Col>
                        <h1>{resolveText('JanKIS')}</h1>
                    </Col>
                </Row>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Username')}</FormLabel>
                    <Col>
                        <FormControl required
                            value={username}
                            onChange={(e:any) => setUsername(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Password')}</FormLabel>
                    <Col>
                        <FormControl required
                            type="password"
                            value={password}
                            onChange={(e:any) => setPassword(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <AsyncButton
                    type="submit"
                    activeText={resolveText('Login')}
                    executingText={resolveText('LoggingIn...')}
                    isExecuting={isLoggingIn}
                />
            </Container>
            </Form>
        </>
    );

}