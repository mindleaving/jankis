import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

interface InitialsModalProps {
    show: boolean;
    requestClose: () => void;
    setInitials: (initials: string) => void;
}

export const InitialsModal = (props: InitialsModalProps) => {

    const [initials, setInitials] = useState<string>('');

    return (
        <Modal show={props.show} onHide={props.requestClose}>
            <Modal.Header closeButton>
                <Modal.Title>Enter a username</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col>Lese bitte erst die Beschreibung der Login-Funktion auf der Startseite</Col>
                    </Row>
                    <Form.Group as={Row}>
                        <Form.Label column>Username</Form.Label>
                        <Col>
                            <Form.Control
                                type="text"
                                aria-autocomplete="list"
                                value={initials}
                                onChange={(e:any) => setInitials(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.requestClose}>Cancel</Button>
                <Button onClick={() => props.setInitials(initials)}>Set</Button>
            </Modal.Footer>
        </Modal>
    );
}