import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { NotificationContainer } from 'react-notifications';
import { useHistory } from 'react-router-dom';
import { QRScannerModal } from '../modals/QRScannerModal';
import { CommonMenu } from './Menus/CommonMenu';
import { NurseMenu } from './Menus/NurseMenu';
import { QRScannerMenu } from './Menus/QRScannerMenu';
import { RegistrationMenu } from './Menus/RegistrationMenu';

interface LayoutProps extends React.PropsWithChildren<{}> {}

export const Layout = (props: LayoutProps) => {

    const history = useHistory();
    const userRoles: string[] = ["nurse"];
    // TODO: Handle multiple roles
    let userMenu;
    switch(userRoles[0]) {
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
    const [ showQRScannerModal, setShowQRScannerModal ] = useState<boolean>(false);
    const openQRScannerModal = () => {
        setShowQRScannerModal(true);
    }

    return (
        <>
            <NotificationContainer />
            <Navbar bg="light" expand="md" sticky="top">
                <Navbar.Brand onClick={() => history.push('/')}>JanKIS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {userMenu}
                    {!userRoles.some(roleName => roleName === "Patient") ? <QRScannerMenu openQRScannerModal={openQRScannerModal}  /> : null}
                    <CommonMenu />
                </Navbar.Collapse>
            </Navbar>
            <Container className="mt-3">
                {props.children}
            </Container>
            <QRScannerModal show={showQRScannerModal} onHide={() => setShowQRScannerModal(false)} />
        </>
    );

}