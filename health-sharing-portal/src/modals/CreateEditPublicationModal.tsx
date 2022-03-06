import React from 'react';
import { Modal } from 'react-bootstrap';
import { PublicationForm } from '../components/Study/PublicationForm';

interface CreateEditPublicationModalProps {}

export const CreateEditPublicationModal = (props: CreateEditPublicationModalProps) => {

    return (
        <Modal show>
            <Modal.Body>
                <PublicationForm />
            </Modal.Body>
        </Modal>
    );

}