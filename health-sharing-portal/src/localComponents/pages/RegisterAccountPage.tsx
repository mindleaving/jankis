import React from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';

interface RegisterAccountPageProps {}

export const RegisterAccountPage = (props: RegisterAccountPageProps) => {

    const { role } = useParams();
    
    const signUpWithXXX = () => {

    }

    return (
        <>
            <h1>{resolveText("Register")}</h1>

            <Row>
                <Col></Col>
                <Col xs={2}>
                    <Button className='signUpButton' onClick={signUpWithXXX}>Sign up with XXX</Button>
                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col xs={2}>
                    <Button className='signUpButton' onClick={signUpWithXXX}>Sign up with XXX</Button>
                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col xs={2}>
                    <Button className='signUpButton' onClick={signUpWithXXX}>Sign up with XXX</Button>
                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col xs={2}>
                    <Button className='signUpButton' onClick={signUpWithXXX}>Sign up with XXX</Button>
                </Col>
                <Col></Col>
            </Row>
            <hr />

            <Form>
                <FormGroup>
                    <FormLabel></FormLabel>
                </FormGroup>
            </Form>
        </>
    );

}