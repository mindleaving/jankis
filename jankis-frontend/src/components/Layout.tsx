import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { NotificationContainer } from 'react-notifications';
import { useHistory } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import { QRScannerModal } from '../modals/QRScannerModal';
import { CommonMenu } from './Menus/CommonMenu';
import { ConfigMenu } from './Menus/ConfigMenu';
import { DepartmentMenu } from './Menus/DepartmentMenu';
import { LoggedInUser } from './Menus/LoggedInUser';
import { NurseMenu } from './Menus/NurseMenu';
import { QRScannerMenu } from './Menus/QRScannerMenu';
import { RegistrationMenu } from './Menus/RegistrationMenu';

interface LayoutProps extends React.PropsWithChildren<{}> {
    onLogOut: () => void;
}

export const Layout = (props: LayoutProps) => {

    const history = useHistory();
    const user = useContext(UserContext)!;
    let userMenus = user.roles.map(role => {
        switch(role.name.toLowerCase()) {
            case "registration":
                return (<RegistrationMenu />);
            case "nurse":
                return (<NurseMenu />);
            default:
                return null;
        }
    }).filter(x => x !== null);
    
    const [ showQRScannerModal, setShowQRScannerModal ] = useState<boolean>(false);
    const openQRScannerModal = () => {
        setShowQRScannerModal(true);
    }

    return (
        <>
            <NotificationContainer />
            <Navbar bg="light" expand="md" sticky="top">
                <Navbar.Brand className="clickable" onClick={() => history.push('/')}>JanKIS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {userMenus}
                    {!user.roles.some(role => role.name === "Patient") ? <DepartmentMenu /> : null}
                    <ConfigMenu />
                    {!user.roles.some(role => role.name === "Patient") ? <QRScannerMenu openQRScannerModal={openQRScannerModal}  /> : null}
                    <CommonMenu />
                    <LoggedInUser user={user} onLogOut={props.onLogOut} />
                </Navbar.Collapse>
            </Navbar>
            <Container className="mt-3">
                {props.children}
            </Container>
            <QRScannerModal show={showQRScannerModal} onHide={() => setShowQRScannerModal(false)} />
        </>
    );

}