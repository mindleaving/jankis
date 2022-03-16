import React from 'react';
import { Modal } from 'react-bootstrap';
import { ContactPersonForm } from '../components/Study/ContactPersonForm';
import { resolveText } from '../helpers/Globalizer';

interface CreateEditContactPersonModalProps {
    show?: boolean;
    onCloseRequested: () => void;
}

export const CreateEditContactPersonModal = (props: CreateEditContactPersonModalProps) => {

    return (
        <Modal show={props.show} onHide={props.onCloseRequested}>
            <Modal.Header closeButton>{resolveText("AddContactPerson")}</Modal.Header>
            <Modal.Body>
                <ContactPersonForm />
            </Modal.Body>
        </Modal>
    );

}