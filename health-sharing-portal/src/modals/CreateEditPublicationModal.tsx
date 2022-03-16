import React from 'react';
import { Modal } from 'react-bootstrap';
import { PublicationForm } from '../components/Study/PublicationForm';
import { resolveText } from '../helpers/Globalizer';

interface CreateEditPublicationModalProps {
    show?: boolean;
    onCloseRequested: () => void;
}

export const CreateEditPublicationModal = (props: CreateEditPublicationModalProps) => {

    return (
        <Modal show={props.show} onHide={props.onCloseRequested}>
            <Modal.Header closeButton>{resolveText("AddPublication")}</Modal.Header>
            <Modal.Body>
                <PublicationForm />
            </Modal.Body>
        </Modal>
    );

}