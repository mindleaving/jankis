import React from 'react';
import { Modal } from 'react-bootstrap';
import { PublicationForm } from '../components/Study/PublicationForm';

interface CreateEditPublicationModalProps {
    show?: boolean;
}

export const CreateEditPublicationModal = (props: CreateEditPublicationModalProps) => {

    return (
        <Modal show={props.show}>
            <Modal.Body>
                <PublicationForm />
            </Modal.Body>
        </Modal>
    );

}