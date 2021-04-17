import React, { ReactNode } from 'react';
import { Button } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';
import { DiagnosticTestScaleType, PatientEventType } from '../../types/enums.d';
import { Models } from '../../types/models';

interface PatientTimelineItemProps {
    event: Models.IPatientEvent;
}

export const PatientTimelineItem = (props: PatientTimelineItemProps) => {

    const history = useHistory();
    let colorVariant = "primary";
    let body: ReactNode = null;
    if(props.event.type === PatientEventType.Note) {
        const note = props.event as Models.PatientNote;
        colorVariant = "primary";
        body = note.message;
    }
    else if(props.event.type === PatientEventType.Observation) {
        const observation = props.event as Models.Observation;
        colorVariant = "warning";
    }
    else if(props.event.type === PatientEventType.TestResult) {
        const testResult = props.event as Models.DiagnosticTestResult;
        colorVariant = "info";
        if(testResult.scaleType === DiagnosticTestScaleType.Freetext) {
            const freetextTestResult = testResult as Models.FreetextDiagnosticTestResult;
            body = (<>
                <Alert.Heading>{testResult.testName} (LOINC: {testResult.testCodeLoinc} / Local: {testResult.testCodeLocal})</Alert.Heading>
                {freetextTestResult.text}
            </>);
        } else if(testResult.scaleType === DiagnosticTestScaleType.Document) {
            const documentTestResult = testResult as Models.DocumentDiagnosticTestResult;
            body = (<>
                <Alert.Heading>{testResult.testName} (LOINC: {testResult.testCodeLoinc} / Local: {testResult.testCodeLocal})</Alert.Heading>
                <Button onClick={() => history.push(`/documents/${documentTestResult.documentId}`)}>{resolveText('Open')}</Button>
            </>);
        } else if(testResult.scaleType === DiagnosticTestScaleType.Quantitative) {
            const quantitiveResult = testResult as Models.QuantitativeDiagnosticTestResult;
            body = (<>
                <Alert.Heading>{testResult.testName} (LOINC: {testResult.testCodeLoinc} / Local: {testResult.testCodeLocal})</Alert.Heading>
                {quantitiveResult.value} {quantitiveResult.unit}
            </>);
        } else if(testResult.scaleType === DiagnosticTestScaleType.Ordinal) {
            const ordinalResult = testResult as Models.OrdinalDiagnosticTestResult;
            body = (<>
                <Alert.Heading>{testResult.testName} (LOINC: {testResult.testCodeLoinc} / Local: {testResult.testCodeLocal})</Alert.Heading>
                {ordinalResult.value}
            </>);
        } else if(testResult.scaleType === DiagnosticTestScaleType.Nominal) {
            const nominalResult = testResult as Models.NominalDiagnosticTestResult;
            body = (<>
                <Alert.Heading>{testResult.testName} (LOINC: {testResult.testCodeLoinc} / Local: {testResult.testCodeLocal})</Alert.Heading>
                {nominalResult.value}
            </>);
        }
    }

    return (
        <Alert variant={colorVariant}>
            <div><small>{new Date(props.event.timestamp).toLocaleString()} {resolveText('by')} {props.event.createdBy}</small></div>
            {body}
        </Alert>
    );

}