import React from 'react';
import Button from "react-bootstrap/Button";
import { useHistory } from 'react-router-dom';

interface TutorialsPageProps {

}

export const TutorialsPage = (props: TutorialsPageProps) => {
    const history = useHistory();
    return (
        <>
            <h1>Tutorials</h1>
            <h2>- wie kann ich mithelfen?</h2>
            <p>Wähle einen Bereich mit dem du helfen möchtest</p>
            <ul style={{ listStyleType: 'none' }}>
                <li>
                    <Button variant="link" onClick={() => history.push('/tutorials/icd11')}>Annotiere den ICD-11</Button>
                </li>
                <li>
                    <Button variant="link" onClick={() => history.push('/tutorials/patientsquestionaire')} disabled>Entwickle den Patientenbogen</Button>
                </li>
                <li>
                    <Button variant="link" onClick={() => history.push('/tutorials/docsupport')} disabled>Entwickle den Ärzte-Ratgeber</Button>
                </li>
                <li>
                    <Button variant="link" onClick={() => history.push('/tutorials/app')} disabled>Entwickle die Android-App</Button>
                </li>
            </ul>
        </>
    );
}