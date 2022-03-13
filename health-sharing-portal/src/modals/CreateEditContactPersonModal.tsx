import React from 'react';
import { Modal } from 'react-bootstrap';
import { PublicationForm } from '../components/Study/PublicationForm';

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