import React, { ReactNode } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { apiClient } from '../../communication/ApiClient';
import { formatDiagnosticTestNameOfResult } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { PatientEventType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { DiagnosticTestValueView } from './DiagnosticTestValueView';

interface PatientTimelineItemProps {
    event: Models.IPatientEvent;
}

export const PatientTimelineItem = (props: PatientTimelineItemProps) => {

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
        const observation = props.event as Models.Observations.Observation;
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
        const testResult = props.event as Models.DiagnosticTestResults.DiagnosticTestResult;
        colorVariant = "info";
        symbol = "fa-flask";
        body = (<>
            <div><b>{formatDiagnosticTestNameOfResult(testResult)}</b></div>
            <DiagnosticTestValueView testResult={testResult} />
        </>);
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