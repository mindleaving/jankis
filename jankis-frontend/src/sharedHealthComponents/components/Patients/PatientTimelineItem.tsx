import { ReactNode } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { canResolveText, resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate, formatDiagnosisNameAndCode, formatDiagnosticTestNameOfResult, formatObservationValue } from '../../helpers/Formatters';
import { DiagnosticTestValueView } from './DiagnosticTestValueView';

interface PatientTimelineItemProps {
    event: Models.IHealthRecordEntry;
}

export const PatientTimelineItem = (props: PatientTimelineItemProps) => {

    let colorVariant = "primary";
    let symbol = "fa-align-justify";
    let body: ReactNode = null;
    if(props.event.type === HealthRecordEntryType.Note) {
        const note = props.event as Models.PatientNote;
        colorVariant = "primary";
        symbol = "fa-comment";
        body = note.message;
    }
    else if(props.event.type === HealthRecordEntryType.Diagnosis) {
        const diagnosis = props.event as ViewModels.DiagnosisViewModel;
        colorVariant = "success";
        symbol = "fa-exclamation-circle";
        body = (<>
            {resolveText("HealthRecordEntryType_Diagnosis")}: <strong>{formatDiagnosisNameAndCode(diagnosis)}</strong>
        </>);
    }
    else if(props.event.type === HealthRecordEntryType.Observation) {
        const observation = props.event as Models.Observations.Observation;
        colorVariant = "warning";
        symbol = "fa-stethoscope";
        body = (<>
            {canResolveText(`MeasurementType_${observation.measurementType}`) ? resolveText(`MeasurementType_${observation.measurementType}`) : observation.measurementType} {formatObservationValue(observation)}
        </>);
    }
    else if(props.event.type === HealthRecordEntryType.Document) {
        const document = props.event as Models.PatientDocument;
        colorVariant = "secondary";
        symbol = "fa-file";
        body = (<>
           {resolveText('HealthRecordEntryType_Document')}: <a href={apiClient.instance!.buildUrl(`api/documents/${document.id}/download`, {})} download>{document.fileName}</a>
        </>)
    }
    else if(props.event.type === HealthRecordEntryType.TestResult) {
        const testResult = props.event as Models.DiagnosticTestResults.DiagnosticTestResult;
        colorVariant = "info";
        symbol = "fa-flask";
        body = (<>
            <div><b>{formatDiagnosticTestNameOfResult(testResult)}</b></div>
            <DiagnosticTestValueView testResult={testResult} />
        </>);
    }

    return (
        <Alert variant={colorVariant} className="px-2 py-1">
            <Row>
                <Col xs="auto">
                    <i className={`fa ${symbol} timelineItemSymbol`} />
                </Col>
                <Col>
                    <div><small>{formatDate(new Date(props.event.timestamp))} {resolveText('by')} {props.event.createdBy}</small></div>
                    {body}
                </Col>
            </Row>
        </Alert>
    );

}