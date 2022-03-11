import React, { PropsWithChildren, useContext } from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { NotificationContainer } from 'react-notifications';
import { useNavigate } from 'react-router-dom';
import { LoggedInUser } from './components/Menus/LoggedInUser';
import UserContext from './contexts/UserContext';

interface LayoutProps extends React.PropsWithChildren<{}> {
    onLogOut: () => void;
}

export const Layout = (props: PropsWithChildren<LayoutProps>) => {

    const user = useContext(UserContext)!;
    const navigate = useNavigate();
    return (
        <>
            <NotificationContainer />
            <Navbar bg="light" expand="md" sticky="top">
                <Navbar.Brand className="clickable" onClick={() => navigate('/')}>Health Sharing Portal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <LoggedInUser user={user} onLogOut={props.onLogOut} />
                </Navbar.Collapse>
            </Navbar>
            <Container>
                <Row>
                    <Col>
                        {props.children}
                    </Col>
                </Row>
            </Container>
        </>
    );

}