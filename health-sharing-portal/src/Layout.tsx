import React, { PropsWithChildren, useContext } from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { NotificationContainer } from 'react-notifications';
import { useNavigate } from 'react-router-dom';
import { AdminMenu } from './localComponents/components/Menus/AdminMenu';
import { HealthProfessionalMenu } from './localComponents/components/Menus/HealthProfessionalMenu';
import { LoggedInUser } from './localComponents/components/Menus/LoggedInUser';
import { ResearcherMenu } from './localComponents/components/Menus/ResearcherMenu';
import { SharerMenu } from './localComponents/components/Menus/SharerMenu';
import UserContext from './localComponents/contexts/UserContext';
import { AccountType } from './localComponents/types/enums.d';

interface LayoutProps extends React.PropsWithChildren<{}> {
    onLogOut: () => void;
}

export const Layout = (props: PropsWithChildren<LayoutProps>) => {

    const user = useContext(UserContext)!;
    const navigate = useNavigate();

    let userTypeMenus = null;
    switch(user?.accountType) {
        case AccountType.Admin:
            userTypeMenus = (<AdminMenu />);
            break;
        case AccountType.HealthProfessional:
            userTypeMenus = (<HealthProfessionalMenu />);
            break;
        case AccountType.Researcher:
            userTypeMenus = (<ResearcherMenu />);
            break;
        case AccountType.Sharer:
            userTypeMenus = (<SharerMenu />);
            break;
    }
    if(user?.accountType === AccountType.Sharer) {
        
    }

    return (
        <>
            <NotificationContainer />
            <Navbar bg="light" expand="md" sticky="top">
                <Navbar.Brand className="clickable" onClick={() => navigate('/')}>Health Sharing Portal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    {userTypeMenus}
                    <Nav className='me-auto'></Nav>
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