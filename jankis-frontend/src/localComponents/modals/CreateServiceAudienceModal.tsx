import { Form, Modal } from 'react-bootstrap';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { ServiceAudienceEditForm } from '../components/Services/ServiceAudienceEditForm';
import { Models } from '../types/models';

interface CreateServiceAudienceModalProps {
    show: boolean;
    onClose: () => void;
    onServiceAudienceCreated: (audienceItem: Models.Services.ServiceAudience) => void;
}

export const CreateServiceAudienceModal = (props: CreateServiceAudienceModalProps) => {

    const addAudienceItem = (audienceItem: Models.Services.ServiceAudience) => {
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