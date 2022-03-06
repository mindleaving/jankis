import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { resolveText } from '../../helpers/Globalizer';

interface StandardQuestionsProps {

}

export const StandardQuestions = (props: StandardQuestionsProps) => {
    return (
        <>
        <Form.Group as={Row}>
            <Form.Label column>{resolveText('FirstName')}</Form.Label>
            <Col>
                <Form.Control>

                </Form.Control>
            </Col>
        </Form.Group>
        <Form.Group as={Row}>
            <Form.Label column>{resolveText('LastName')}</Form.Label>
            <Col>
                <Form.Control>

                </Form.Control>
            </Col>
        </Form.Group>
        </>
    );
}