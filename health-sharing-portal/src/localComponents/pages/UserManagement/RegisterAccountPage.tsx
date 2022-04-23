import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { LoginProvider } from '../../types/enums.d';
import { CreateLocalAccountForm } from '../../components/UserManagement/CreateLocalAccountForm';
import { useEffect, useState } from 'react';
import { CreateAccountForm } from '../../components/UserManagement/CreateAccountForm';


interface RegisterAccountPageProps {}

export const RegisterAccountPage = (props: RegisterAccountPageProps) => {

    const { accountType } = useParams();
    const navigate = useNavigate();
    const [ isCheckingLoginStatus, setIsCheckingLoginStatus ] = useState<boolean>(true);
    const [ isLoggedIn, setIsLoggedIn ] = useState<boolean>(false);
    

    useEffect(() => {
        setIsCheckingLoginStatus(true);
        const checkLoginStatus = async () => {
            try {
                const result = await apiClient.instance!.isLoggedIn();
                setIsLoggedIn(result);
            } catch {
                // Do nothing
            } finally {
                setIsCheckingLoginStatus(false);
            }
        };
        checkLoginStatus();
    }, []);

    const externalLogin = (loginProvider: LoginProvider) => {
        NotificationManager.info(resolveText("Redirecting..."));
        const redirectUrl = encodeURIComponent(`https://${window.location.host}/register/${accountType}`);
        const actionUrl = apiClient.instance!.buildUrl(`api/accounts/external-login/${loginProvider}?accountType=${accountType}&redirectUrl=${redirectUrl}`, {});
        window.location.href = actionUrl;
    }

    const localLogin = () => {
        navigate(`/login/${accountType}?accountType=${accountType}&redirectUrl=/register/${accountType}`);
    }

    
    if(isCheckingLoginStatus) {
        return (<h3>{resolveText("CheckingLogin...")}</h3>);
    }

    if(!isLoggedIn) {
        const loginProviders = [
            { loginProvider: LoginProvider.Google, iconId: 'google' },
            { loginProvider: LoginProvider.Twitter, iconId: 'twitter' },
            { loginProvider: LoginProvider.Microsoft, iconId: 'windows' },
            { loginProvider: LoginProvider.Facebook, iconId: 'facebook' }
        ];
    
        return (
            <>
                <h1>{resolveText("Register")}</h1>
                <Row className='mt-3'>
                    {loginProviders.map(x => (
                        <Col key={x.loginProvider} xs="auto">
                            <Button
                                size="lg"
                                variant="outline-dark"
                                onClick={() => externalLogin(x.loginProvider)}
                            >
                                <i className={`fa fa-${x.iconId}`} />
                            </Button>
                        </Col>
                    ))}
                    <Col />
                </Row>
                <Row>
                    <Col>
                        <div className="timelineSeparator">
                            <span className="text-secondary">{resolveText('or')}</span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CreateLocalAccountForm
                            onLoginCreated={localLogin}
                        />
                    </Col>
                </Row>
            </>
        );
    }

    return (
        <CreateAccountForm
            onAccountCreated={() => navigate("/")}
        />
    )

}