import React from 'react';
import { Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';

interface PatientProfileJumbotronProps {
    profileData: Models.Person;
}

export const PatientProfileJumbotron = (props: PatientProfileJumbotronProps) => {

    const firstName = props.profileData.firstName;
    const lastName = props.profileData.lastName;
    const birthDate = props.profileData.birthDate;

    // TODO
    const ward = "2/4";
    const room = "261";
    const bed = "T";
    const height = "172 cm";
    const weight = "68 kg";

    return (
        <Jumbotron className="p-3" style={{ borderRadius: '10px' }}>
            <Container>
                <Row>
                    <Col><h2>{firstName} {lastName}</h2></Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        {resolveText('Patient_BirthDate')}: {new Date(birthDate).toLocaleDateString()}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{ border: '2px solid black', width: '150px', height: '200px' }} className="text-center">
                            Image
                        </div>
                    </Col>
                    <Col>
                        <Row>
                            <Col><b>{resolveText('Ward')}</b></Col>
                            <Col>{ward}</Col>
                        </Row>
                        <Row>
                            <Col><b>{resolveText('Room')}</b></Col>
                            <Col>{room}</Col>
                        </Row>
                        <Row>
                            <Col><b>{resolveText('Bed')}</b></Col>
                            <Col>{bed}</Col>
                        </Row>
                        <Row>
                            <Col><b>{resolveText('Patient_Height')}</b></Col>
                            <Col>{height}</Col>
                        </Row>
                        <Row>
                            <Col><b>{resolveText('Patient_Weight')}</b></Col>
                            <Col>{weight}</Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    );

}