import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import { Form } from 'react-bootstrap';
import { FeedbackModal } from './modals/FeedbackModal';

interface LayoutProps extends React.PropsWithChildren<{}> {
    username?: string;
    onLogin: () => void;
    onLogout: () => void;
}

export const Layout = (props: LayoutProps) => {
    const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
    const history = useHistory();
    return (
        <>
            <NotificationContainer />
            <Navbar bg="light" expand="md" sticky="top">
                <Navbar.Brand onClick={() => history.push('/')}>Doctor's To-Do</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => history.push('/')}>Home</Nav.Link>
                        
                        <NavDropdown title="For patients" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => history.push('/questionaire')}>Questionaire</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="For doctors" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => history.push('/patients')}>Patients</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="For maintainers" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => history.push('/tutorials')}>Tutorials</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => history.push('/diseases')}>Diseases</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => history.push('/symptoms')}>Symptoms</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => history.push('/observations')}>Observations</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => history.push('/bodystructures')}>Body structures</NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link onClick={() => history.push('/legal')}>Legal</Nav.Link>
                    </Nav>
                    <Form inline className="mr-3 my-1 my-md-0">
                        {props.username ? <Form.Label className="mr-3">Hello, {props.username}</Form.Label> : null}
                        {props.username 
                            ? <Button onClick={props.onLogout}><i className="fa fa-lock" /> Log out</Button>
                            : <Button variant="success" onClick={props.onLogin}><i className="fa fa-lock mr-1" /> Login</Button>
                        }
                    </Form>
                    <Form inline className="mr-3 my-1 my-md-0">
                        <Button variant="secondary" onClick={() => setShowFeedbackModal(true)} disabled={showFeedbackModal}>Feedback</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
            <FeedbackModal show={showFeedbackModal} onCancel={() => setShowFeedbackModal(false)} />
            <Container className="mt-3">
                {props.children}
            </Container>
        </>
    );
}