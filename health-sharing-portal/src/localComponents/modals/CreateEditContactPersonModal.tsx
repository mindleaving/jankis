import React from 'react';
import { Modal } from 'react-bootstrap';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { ContactPersonForm } from '../components/Study/ContactPersonForm';
import { Models } from '../types/models';

interface CreateEditContactPersonModalProps {
    show?: boolean;
    onCloseRequested: () => void;
    contactPerson?: Models.Contact;
    onContactPersonCreated: (contactPerson: Models.Contact) => void;
}

export const CreateEditContactPersonModal = (props: CreateEditContactPersonModalProps) => {

    return (
        <Modal show={props.show} onHide={props.onCloseRequested}>
            <Modal.Header closeButton>{resolveText("AddContactPerson")}</Modal.Header>
            <Modal.Body>
                <ContactPersonForm
                    contactPerson={props.contactPerson}
                    onSubmit={props.onContactPersonCreated}
                />
            </Modal.Body>
        </Modal>
    );

}