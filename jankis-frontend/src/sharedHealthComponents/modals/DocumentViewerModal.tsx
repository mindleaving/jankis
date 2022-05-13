import React from 'react';
import { Modal } from 'react-bootstrap';
import { Models } from '../../localComponents/types/models';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { DocumentViewer } from '../components/Documents/DocumentViewer';

interface DocumentViewerModalProps {
    document: Models.PatientDocument;
    show: boolean;
    onCloseRequested: () => void;
}

export const DocumentViewerModal = (props: DocumentViewerModalProps) => {

    return (
        <Modal 
            size="lg"
            show={props.show} 
            onHide={props.onCloseRequested}
        >
            <Modal.Header closeButton>
                {resolveText("Document")} {props.document.id}
            </Modal.Header>
            <Modal.Body>
                <DocumentViewer
                    document={props.document}
                />
            </Modal.Body>
        </Modal>
    );

}