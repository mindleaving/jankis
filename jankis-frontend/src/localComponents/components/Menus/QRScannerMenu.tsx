import React from 'react';
import Nav from 'react-bootstrap/esm/Nav';

interface QRScannerMenuProps {
    openQRScannerModal: () => void;
}

export const QRScannerMenu = (props: QRScannerMenuProps) => {

    return (
        <Nav className="ms-auto me-1">
            <Nav.Link onClick={props.openQRScannerModal}><i className="fa fa-qrcode" title="Scan QR code" /></Nav.Link>
        </Nav>
    );

}