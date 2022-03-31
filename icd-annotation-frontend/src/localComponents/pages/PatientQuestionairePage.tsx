import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/esm/Button";
import { DynamicQuestions } from "../components/PatientQuestionaire/DynamicQuestions";
import { StandardQuestions } from "../components/PatientQuestionaire/StandardQuestions";
import { getPreferedLanguage, resolveText } from "../../sharedCommonComponents/helpers/Globalizer";

interface PatientQuestionairePageProps {

}

export const PatientQuestionairePage = (props: PatientQuestionairePageProps) => {

    const [language, setLanguage] = useState<string>(getPreferedLanguage());

    return (
        <>
        <h1>Hello :)</h1>
        <h2>How can we help you?</h2>
        <p>
            This questionaire will (in the future) collect some basic information about the patient's illness/injury/problem.
            The questions, apart from some standard questions, are dynamically generated based on the information given so far.
            The patient is free to skip questions, mark them to be discussed in person with the doctor, or terminate the questionaire.
        </p>
        <p>
            Doctors will get a SOAP-summary based on the patient's answers (although the AP-part may be skipped if not enough information is available).
        </p>
        <Form>
            <Form.Group as={Row}>
                <Form.Label column>Language:</Form.Label>
                <Col xs="auto">
                    <Form.Control
                        as="select"
                        value={language}
                        onChange={(e:any) => setLanguage(e.target.value)}
                    >
                        <option value="de">Deutsch</option>
                        <option value="en">English</option>
                    </Form.Control>
                </Col>
            </Form.Group>

            <StandardQuestions />
            <DynamicQuestions />

            <Button className="m-2">{resolveText('PleaseNoMoreQuestions')}</Button>
            <Button className="m-2">{resolveText('SkipQuestion')}</Button>
        </Form>
        </>
    );
}