import React, { PropsWithChildren } from 'react';
import { Container, Col, Row, Navbar, Nav, Button } from 'react-bootstrap';
import { NotificationContainer } from 'react-notifications';
import { useNavigate } from 'react-router-dom';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';

interface NoUserLayoutProps {}

export const NoUserLayout = (props: PropsWithChildren<NoUserLayoutProps>) => {

    const navigate = useNavigate();
    return (
        <>
        <Navbar bg="secondary" variant="dark" expand="md">
            <Navbar.Brand>{resolveText("HealthSharingPortal")}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav>
                    <Nav.Link onClick={() => navigate("/")}>{resolveText("Home")}</Nav.Link>
                </Nav>
                <Nav className='ms-auto me-3'>
                    <Button onClick={() => navigate("/login")}>{resolveText("Login")}</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <Container className='mt-3'>
            <Row>
                <Col>
                    {props.children}
                </Col>
            </Row>
        </Container>
        <NotificationContainer />
        </>
    );

}