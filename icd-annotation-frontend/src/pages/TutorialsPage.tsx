import React from 'react';
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';

interface TutorialsPageProps {

}

export const TutorialsPage = (props: TutorialsPageProps) => {
    const navigate = useNavigate();
    return (
        <>
            <h1>Tutorials</h1>
            <h2>- wie kann ich mithelfen?</h2>
            <p>Wähle einen Bereich mit dem du helfen möchtest</p>
            <ul style={{ listStyleType: 'none' }}>
                <li>
                    <Button variant="link" onClick={() => navigate('/tutorials/icd11')}>Annotiere den ICD-11</Button>
                </li>
                <li>
                    <Button variant="link" onClick={() => navigate('/tutorials/patientsquestionaire')} disabled>Entwickle den Patientenbogen</Button>
                </li>
                <li>
                    <Button variant="link" onClick={() => navigate('/tutorials/docsupport')} disabled>Entwickle den Ärzte-Ratgeber</Button>
                </li>
                <li>
                    <Button variant="link" onClick={() => navigate('/tutorials/app')} disabled>Entwickle die Android-App</Button>
                </li>
            </ul>
        </>
    );
}