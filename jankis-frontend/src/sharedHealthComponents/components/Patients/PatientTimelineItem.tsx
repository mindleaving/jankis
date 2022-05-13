import { ReactNode, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import UserContext from '../../../localComponents/contexts/UserContext';
import { needsHiding } from '../../../localComponents/helpers/HealthRecordEntryHelpers';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { canResolveText, resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate, formatDiagnosisNameAndCode, formatDiagnosticTestNameOfResult, formatDispension, formatDrug, formatObservationValue } from '../../helpers/Formatters';
import { DiagnosticTestValueView } from '../TestResults/DiagnosticTestValueView';
import { HidableHealthRecordEntryValue } from '../HidableHealthRecordEntryValue';
import { unhideHealthRecordEntry } from '../../helpers/HealthRecordEntryHelpers';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { DocumentButtons } from '../TestResults/DocumentButtons';

interface PatientTimelineItemProps {
    entry: Models.IHealthRecordEntry;
}

export const PatientTimelineItem = (props: PatientTimelineItemProps) => {

    const user = useContext(UserContext);
    const dispatch = useAppDispatch();
    const entry = props.entry;
    const hideValue = needsHiding(entry, user!);

    let colorVariant = "primary";
    let symbol = "fa-align-justify";
    let body: ReactNode = null;
    if(entry.type === HealthRecordEntryType.Note) {
        const note = entry as Models.PatientNote;
        colorVariant = "primary";
        symbol = "fa-comment";
        body = note.message;
    }
    else if(entry.type === HealthRecordEntryType.Diagnosis) {
        const diagnosis = entry as ViewModels.DiagnosisViewModel;
        colorVariant = "success";
        symbol = "fa-exclamation-circle";
        body = (<>
            {resolveText("HealthRecordEntryType_Diagnosis")}: <strong>{formatDiagnosisNameAndCode(diagnosis)}</strong>
        </>);
    }
    else if(entry.type === HealthRecordEntryType.Observation) {
        const observation = entry as Models.Observations.Observation;
        colorVariant = "warning";
        symbol = "fa-stethoscope";
        body = (<>
            {canResolveText(`MeasurementType_${observation.measurementType}`) ? resolveText(`MeasurementType_${observation.measurementType}`) : observation.measurementType} {formatObservationValue(observation)}
        </>);
    }
    else if(entry.type === HealthRecordEntryType.MedicationDispension || entry.type === HealthRecordEntryType.Immunization) {
        const medicationDispension = entry as Models.Medication.MedicationDispension;
        colorVariant = "secondary";
        symbol = "fa-medkit";
        body = (<>
            {formatDrug(medicationDispension.drug)}: {formatDispension(medicationDispension)}
        </>);
    }
    else if(entry.type === HealthRecordEntryType.Document) {
        const document = entry as Models.PatientDocument;
        colorVariant = "secondary";
        symbol = "fa-file";
        body = (<>
            <DocumentButtons documentId={document.id} /> {document.fileName}
        </>)
    }
    else if(entry.type === HealthRecordEntryType.TestResult) {
        const testResult = entry as Models.DiagnosticTestResults.DiagnosticTestResult;
        colorVariant = "info";
        symbol = "fa-flask";
        body = (<>
            <div><b>{formatDiagnosticTestNameOfResult(testResult)}</b></div>
            <DiagnosticTestValueView testResult={testResult} />
        </>);
    }

    const unhide = () => unhideHealthRecordEntry(dispatch, entry.type, entry.id);

    return (
        <Alert variant={colorVariant} className="px-2 py-1">
            <Row>
                <Col xs="auto">
                    <i className={`fa ${symbol} timelineItemSymbol`} />
                </Col>
                <Col>
                    <div><small>{formatDate(new Date(entry.timestamp))} {resolveText('by')} {entry.createdBy}</small></div>
                    <HidableHealthRecordEntryValue
                        hideValue={hideValue}
                        onMarkAsSeen={unhide}
                    >
                        {body}
                    </HidableHealthRecordEntryValue>
                </Col>
            </Row>
        </Alert>
    );

}