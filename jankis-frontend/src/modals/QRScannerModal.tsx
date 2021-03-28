import React, { useState } from 'react';
import { Button, Col, Modal, Row, Spinner } from 'react-bootstrap';
import { resolveText } from '../helpers/Globalizer';

interface QRScannerModalProps {
    show: boolean;
    onHide: () => void;
}

enum QRCodeType {
    Patient = "Patient",
    Medication = "Medication",
    Resource = "Resource"
}

export const QRScannerModal = (props: QRScannerModalProps) => {

    const [ selectedQRCodeType, setSelectedQRCodeType ] = useState<QRCodeType>();
    const [ waitingForScanner, setWaitingForScanner ] = useState<boolean>(false);

    const setQRCodeType = (qrCodeType: QRCodeType) => {
        // TODO
        setSelectedQRCodeType(qrCodeType);
        setWaitingForScanner(true);
    }

    const resetAndClose = () => {
        props.onHide();
        setWaitingForScanner(false);
    }

    // let localizedQrCodeType;
    // switch(selectedQRCodeType) {
    //     case QRCodeType.Patient:
    //         localizedQrCodeType = resolveText('QRCodeType_Patient');
    //         break;
    //     case QRCodeType.Medication:
    //         localizedQrCodeType = resolveText('QRCodeType_Medication');
    //         break;
    //     case QRCodeType.Resource:
    //         localizedQrCodeType = resolveText('QRCodeType_Resource');
    //         break;
    // }
    const waitingForScannerSpinner = (
        <>
            <Row>
                <Col>{resolveText('QRCodeModal_PleaseScanQRCodes')}...</Col>
            </Row>
            <Row>
                <Col className="text-center">
                    <Spinner animation="border" />
                </Col>
            </Row>
        </>
    )
    const qrCodeTypeButtons = (
        <>
            {resolveText('QRCodeModal_SelectQRCodeType')}
            <Row>
                <Col className="text-center">
                    <Button block size="lg" className="m-2" onClick={() => setQRCodeType(QRCodeType.Patient)}>{resolveText('QRCodeType_Patient')}</Button>
                </Col>
            </Row>
            <Row>
                <Col className="text-center">
                    <Button block size="lg" className="m-2" onClick={() => setQRCodeType(QRCodeType.Medication)}>{resolveText('QRCodeType_Medication')}</Button>
                </Col>
            </Row>
            <Row>
                <Col className="text-center">
                    <Button block size="lg" className="m-2" onClick={() => setQRCodeType(QRCodeType.Resource)}>{resolveText('QRCodeType_Resource')}</Button>
                </Col>
            </Row>
        </>
    );

    return (
        <Modal show={props.show} onHide={resetAndClose}>
            <Modal.Header closeButton>
                <Modal.Title>{resolveText('QRCodeModal_Title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {waitingForScanner 
                ? waitingForScannerSpinner
                : qrCodeTypeButtons}
            </Modal.Body>
        </Modal>
    );

}