import React, { useContext } from 'react';
import { compareDesc } from 'date-fns';
import { Alert, Col, Row } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate } from '../../helpers/Formatters';
import { downloadFile } from '../../../sharedCommonComponents/communication/FileDownloader';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { HidableHealthRecordEntryValue } from './HidableHealthRecordEntryValue';
import { MarkHealthRecordEntryAsSeenCallback } from '../../types/frontendTypes';
import { unhideHealthRecordEntry } from '../../helpers/HealthRecordEntryHelpers';
import UserContext from '../../../localComponents/contexts/UserContext';
import { needsHiding } from '../../../localComponents/helpers/HealthRecordEntryHelpers';

interface PatientDocumentsViewProps {
    documents: Models.PatientDocument[];
    onMarkAsSeen: MarkHealthRecordEntryAsSeenCallback;
}

export const PatientDocumentsView = (props: PatientDocumentsViewProps) => {

    return (<div className="mt-3">
        <div className="timelineSeparator">
            <span className="text-secondary">{resolveText('Now')}</span>
        </div>
        {props.documents.sort((a,b) => compareDesc(new Date(a.timestamp), new Date(b.timestamp))).map(document => (
            <PatientDocumentView
                key={document.id}
                document={document}
                onMarkAsSeen={props.onMarkAsSeen}
            />
        ))}
    </div>);

}

interface PatientDocumentViewProps {
    document: Models.PatientDocument;
    onMarkAsSeen: (entryType: HealthRecordEntryType, entryId: string, update: Update<Models.IHealthRecordEntry>) => void;
}
const PatientDocumentView = (props: PatientDocumentViewProps) => {
    const document = props.document;
    const user = useContext(UserContext);
    const hideValue = needsHiding(document, user!);
    const unhide = () => unhideHealthRecordEntry(document, props.onMarkAsSeen);
    return (<Alert variant="secondary">
        <Row>
            <Col xs="auto" className="align-self-center">
                <HidableHealthRecordEntryValue
                    hideValue={hideValue}
                    onMarkAsSeen={unhide}
                >
                    <i 
                        className="fa fa-file clickable timelineItemSymbol"
                        onClick={() => downloadFile(`api/documents/${props.document.id}/download`)}
                    />
                </HidableHealthRecordEntryValue>
            </Col>
            <Col>
                <Row>
                    <Col lg="4" className="me-3">
                        <div><small>{formatDate(new Date(props.document.timestamp))} {resolveText('by')} {props.document.createdBy}</small></div>
                        {props.document.fileName}
                    </Col>
                    <Col lg="7">
                        {props.document.note
                        ? <>
                            <div><small>{resolveText('Note')}</small></div>
                            <HidableHealthRecordEntryValue
                                hideValue={hideValue}
                                onMarkAsSeen={() => unhideHealthRecordEntry(document, props.onMarkAsSeen)}
                            >
                                {props.document.note}
                            </HidableHealthRecordEntryValue>
                        </> : null}
                    </Col>
                </Row>
            </Col>
        </Row>
    </Alert>);
}