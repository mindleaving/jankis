import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import { NavItem } from 'react-bootstrap';
import { FeedbackModal } from './localComponents/modals/FeedbackModal';

interface LayoutProps extends React.PropsWithChildren<{}> {
    username?: string;
    onLogin: () => void;
    onLogout: () => void;
}

export const Layout = (props: LayoutProps) => {
    const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
    const navigate = useNavigate();
    return (
        <>
            <NotificationContainer />
            <Navbar bg="light" expand="md" sticky="top">
                <Navbar.Brand onClick={() => navigate('/')}>Doctor's To-Do</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
                        
                        <NavDropdown title="For patients" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => navigate('/questionaire')}>Questionaire</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="For doctors" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => navigate('/patients')}>Patients</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="For maintainers" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => navigate('/tutorials')}>Tutorials</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => navigate('/diseases')}>Diseases</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/symptoms')}>Symptoms</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/observations')}>Observations</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/bodystructures')}>Body structures</NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link onClick={() => navigate('/legal')}>Legal</Nav.Link>
                    </Nav>
                    <Nav className='me-auto'></Nav>
                    <Nav className='mx-2'>
                        {props.username 
                        ? <Navbar.Text className='me-2'>
                            Hello, {props.username}
                        </Navbar.Text>
                        : null}
                        <NavItem>
                        {props.username 
                            ? <Button onClick={props.onLogout}><i className="fa fa-lock" /> Log out</Button>
                            : <Button variant="success" onClick={props.onLogin}><i className="fa fa-lock mr-1" /> Login</Button>
                        }
                        </NavItem>
                    </Nav>
                    <Nav className='mx-2'>
                        <NavItem>
                            <Button variant="secondary" onClick={() => setShowFeedbackModal(true)} disabled={showFeedbackModal}>Feedback</Button>
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <FeedbackModal show={showFeedbackModal} onCancel={() => setShowFeedbackModal(false)} />
            <Container className="mt-3">
                {props.children}
            </Container>
        </>
    );
}