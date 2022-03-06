import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

interface BasicInformationBoxProps {
    
}

export const BasicInformationBox = (props: BasicInformationBoxProps) => {

    const name = "Jan Scholtyssek";
    const birthday = new Date("1989-11-17");
    const address = {
        street: "Poststr.",
        houseNumber: "28",
        postalCode: "69115",
        city: "Heidelberg",
        country: "Deutschland"
    };
    const telephone = "+49 174 6322405";
    return (
        <Card>
            <Card.Header>Basic information</Card.Header>
            <Card.Body>
                <h2>{name}</h2>
                <Row>
                    <Col>Birthday</Col>
                    <Col>{birthday.toISOString().substring(0, 10)}</Col>
                </Row>
                <Row>
                    <Col>Address</Col>
                    <Col>
                        {address.street} {address.houseNumber}<br/>
                        {address.postalCode} {address.city} <br />
                        {address.country}
                    </Col>
                </Row>
                <Row>
                    <Col>Telephone</Col>
                    <Col>{telephone}</Col>
                </Row>
            </Card.Body>
        </Card>
    );

}