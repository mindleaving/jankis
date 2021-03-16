import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { NotificationContainer } from 'react-notifications';
import { useHistory } from 'react-router-dom';
import { CommonMenu } from './CommonMenu';
import { NurseMenu } from './NurseMenu';
import { RegistrationMenu } from './RegistrationMenu';

interface LayoutProps extends React.PropsWithChildren<{}> {}

export const Layout = (props: LayoutProps) => {

    const history = useHistory();
    const userRole: string = "nurse";
    let userMenu;
    switch(userRole) {
        case "registration":
            userMenu = <RegistrationMenu />;
            break;
        case "nurse":
            userMenu = <NurseMenu />;
            break;
        default:
            userMenu = null;
            break;
    }
    return (
        <>
            <NotificationContainer />
            <Navbar bg="light" expand="md" sticky="top">
                <Navbar.Brand onClick={() => history.push('/')}>Doctor's To-Do</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {userMenu}
                    <CommonMenu />
                </Navbar.Collapse>
            </Navbar>
            <Container className="mt-3">
                {props.children}
            </Container>
        </>
    );

}