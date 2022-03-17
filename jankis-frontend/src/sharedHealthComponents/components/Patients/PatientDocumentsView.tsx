import React from 'react';
import { compareDesc } from 'date-fns';
import { Alert, Col, Row } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface PatientDocumentsViewProps {
    documents: Models.PatientDocument[];
}

export const PatientDocumentsView = (props: PatientDocumentsViewProps) => {

    return (<div className="mt-3">
        <div className="timelineSeparator">
            <span className="text-secondary">{resolveText('Now')}</span>
        </div>
        {props.documents.sort((a,b) => compareDesc(new Date(a.timestamp), new Date(b.timestamp))).map(document => (
            <PatientDocumentView key={document.id} document={document} />
        ))}
    </div>);

}

interface PatientDocumentViewProps {
    document: Models.PatientDocument;
}
const PatientDocumentView = (props: PatientDocumentViewProps) => {
    return (<Alert variant="secondary">
        <Row>
            <Col xs="auto" className="align-self-center">
                <a 
                    href={apiClient.instance!.buildUrl(`api/documents/${props.document.id}/download`, {})} 
                    download
                >
                    <i className="fa fa-file clickable timelineItemSymbol" />
                </a>
            </Col>
            <Col>
                <Row>
                    <Col lg="4" className="mr-3">
                        <div><small>{new Date(props.document.timestamp).toLocaleString()} {resolveText('by')} {props.document.createdBy}</small></div>
                        {props.document.fileName}
                    </Col>
                    <Col lg="7">
                        {props.document.note
                        ? <>
                            <div><small>{resolveText('Note')}</small></div>
                            {props.document.note}
                        </> : null}
                    </Col>
                </Row>
            </Col>
        </Row>
    </Alert>);
}