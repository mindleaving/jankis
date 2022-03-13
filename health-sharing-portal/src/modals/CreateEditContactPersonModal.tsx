import React from 'react';
import { Modal } from 'react-bootstrap';
import { ContactPersonForm } from '../components/Study/ContactPersonForm';

interface CreateEditContactPersonModalProps {
    show?: boolean;
}

export const CreateEditContactPersonModal = (props: CreateEditContactPersonModalProps) => {

    return (
        <Modal show={props.show}>
            <Modal.Body>
                <ContactPersonForm />
            </Modal.Body>
        </Modal>
    );

}