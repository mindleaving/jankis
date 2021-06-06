import React, { ReactNode } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { apiClient } from '../../communication/ApiClient';
import { formatDiagnosticTestNameOfResult } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { DiagnosticTestScaleType, PatientEventType } from '../../types/enums.d';
import { Models } from '../../types/models';

interface PatientTimelineItemProps {
    event: Models.IPatientEvent;
}

export const PatientTimelineItem = (props: PatientTimelineItemProps) => {

    const history = useHistory();
    let colorVariant = "primary";
    let symbol = "fa-align-justify";
    let body: ReactNode = null;
    if(props.event.type === PatientEventType.Note) {
        const note = props.event as Models.PatientNote;
        colorVariant = "primary";
        symbol = "fa-comment";
        body = note.message;
    }
    else if(props.event.type === PatientEventType.Observation) {
        const observation = props.event as Models.Observation;
        colorVariant = "warning";
        symbol = "fa-stethoscope";
    }
    else if(props.event.type === PatientEventType.Document) {
        const document = props.event as Models.PatientDocument;
        colorVariant = "secondary";
        symbol = "fa-file";
        body = (<>
           {resolveText('PatientEventType_Document')}: <a href={apiClient.buildUrl(`api/documents/${document.id}/download`, {})} download>{document.fileName}</a>
        </>)
    }
    else if(props.event.type === PatientEventType.TestResult) {
        const testResult = props.event as Models.DiagnosticTestResult;
        colorVariant = "info";
        symbol = "fa-flask";
        if(testResult.scaleType === DiagnosticTestScaleType.Freetext) {
            const freetextTestResult = testResult as Models.FreetextDiagnosticTestResult;
            body = (<>
                <div><b>{formatDiagnosticTestNameOfResult(testResult)}</b></div>
                {freetextTestResult.text}
            </>);
        } else if(testResult.scaleType === DiagnosticTestScaleType.Document) {
            const documentTestResult = testResult as Models.DocumentDiagnosticTestResult;
            body = (<>
                <div><b>{formatDiagnosticTestNameOfResult(testResult)}</b></div>
                <Button onClick={() => history.push(`/documents/${documentTestResult.documentId}`)}>{resolveText('Open')}</Button>
            </>);
        } else if(testResult.scaleType === DiagnosticTestScaleType.Quantitative) {
            const quantitiveResult = testResult as Models.QuantitativeDiagnosticTestResult;
            body = (<>
                <div><b>{formatDiagnosticTestNameOfResult(testResult)}</b></div>
                {quantitiveResult.value} {quantitiveResult.unit}
            </>);
        } else if(testResult.scaleType === DiagnosticTestScaleType.Ordinal) {
            const ordinalResult = testResult as Models.OrdinalDiagnosticTestResult;
            body = (<>
                <div><b>{formatDiagnosticTestNameOfResult(testResult)}</b></div>
                {ordinalResult.value}
            </>);
        } else if(testResult.scaleType === DiagnosticTestScaleType.Nominal) {
            const nominalResult = testResult as Models.NominalDiagnosticTestResult;
            body = (<>
                <div><b>{formatDiagnosticTestNameOfResult(testResult)}</b></div>
                {nominalResult.value}
            </>);
        }
    }

    return (
        <Alert variant={colorVariant}>
            <Row>
                <Col xs="auto">
                    <i className={`fa ${symbol} timelineItemSymbol`} />
                </Col>
                <Col>
                    <div><small>{new Date(props.event.timestamp).toLocaleString()} {resolveText('by')} {props.event.createdBy}</small></div>
                    {body}
                </Col>
            </Row>
        </Alert>
    );

}