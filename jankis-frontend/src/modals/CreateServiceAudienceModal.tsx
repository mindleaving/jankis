import { Form, Modal } from 'react-bootstrap';
import { ServiceAudienceEditForm } from '../components/Services/ServiceAudienceEditForm';
import { resolveText } from '../helpers/Globalizer';
import { Models } from '../types/models';

interface CreateServiceAudienceModalProps {
    show: boolean;
    onClose: () => void;
    onServiceAudienceCreated: (audienceItem: Models.ServiceAudience) => void;
}

export const CreateServiceAudienceModal = (props: CreateServiceAudienceModalProps) => {

    const addAudienceItem = (audienceItem: Models.ServiceAudience) => {
        props.onServiceAudienceCreated(audienceItem);
        props.onClose();
    }

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{resolveText('ServiceAudience_Create')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="CreateServiceAudienceModal">
                    <ServiceAudienceEditForm
                        addAudience={addAudienceItem}
                    />
                </Form>
            </Modal.Body>
        </Modal>
    );

}