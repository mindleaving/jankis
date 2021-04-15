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
        <Jumbotron>
            <Container>
                <Row>
                    <Col><b>{firstName} {lastName}</b></Col>
                </Row>
                <Row>
                    <Col>
                        <small>{resolveText('Patient_BirthDate')}: {birthDate.toLocaleDateString()}</small>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{ border: '2px solid black', width: '200px', height: '400px' }} className="text-center">
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