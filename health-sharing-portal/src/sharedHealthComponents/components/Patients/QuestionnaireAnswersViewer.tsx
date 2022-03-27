import React from 'react';
import { Row, Col, FormGroup, FormLabel } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { Models } from '../../../localComponents/types/models';

interface QuestionnaireAnswersViewerProps {
    answers: Models.Interview.QuestionnaireAnswers;
}

export const QuestionnaireAnswersViewer = (props: QuestionnaireAnswersViewerProps) => {

    return (<>
        <Row>
            <Col xs={3}>
                {resolveText("QuestionnaireAnswers_Timestamp")}:
            </Col>
            <Col>
                {new Date(props.answers.timestamp).toISOString()}
            </Col>
        </Row>
        {props.answers.answers.map((answer,questionIndex) => {
            return (
                <FormGroup key={questionIndex} as={Row}>
                    <FormLabel column xs={3}>{answer.question.text}</FormLabel>
                    <Col>
                        <pre>
                            <code>
                                {JSON.stringify(JSON.parse(answer.answer), null, 4)}
                            </code>
                        </pre>
                    </Col>
                </FormGroup>
            )
        })}
        </>
    );

}