import React from 'react';
import { Modal } from 'react-bootstrap';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { PublicationForm } from '../components/Study/PublicationForm';
import { Models } from '../types/models';

interface CreateEditPublicationModalProps {
    show?: boolean;
    onCloseRequested: () => void;
    publication?: Models.Publication;
    onPublicationCreated: (publication: Models.Publication) => void;
}

export const CreateEditPublicationModal = (props: CreateEditPublicationModalProps) => {

    return (
        <Modal show={props.show} onHide={props.onCloseRequested}>
            <Modal.Header closeButton>{resolveText("AddPublication")}</Modal.Header>
            <Modal.Body>
                <PublicationForm 
                    publication={props.publication} 
                    onSubmit={props.onPublicationCreated}
                />
            </Modal.Body>
        </Modal>
    );

}