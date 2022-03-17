import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../communication/ApiClient';
import { Models } from '../types/models';

interface FeedbackModalProps {
    show: boolean;
    onCancel: () => void;
}

export const FeedbackModal = (props: FeedbackModalProps) => {

    const [ message, setMessage ] = useState<string>('');

    const sendFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const feedback: Models.Feedback = {
                url: window.location.href,
                message: message
            }
            await apiClient.instance!.post('api/feedback', {}, feedback);
            NotificationManager.success('Thank you for your feedback :)');
            setMessage('');
            props.onCancel();
        } catch(error: any) {
            NotificationManager.error(error.message, 'Could not send feedback');
        }
    }

    return (
        <Modal show={props.show} onHide={props.onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="FeedbackForm" onSubmit={sendFeedback}>
                    <Form.Group>
                        <Form.Label>Message</Form.Label>
                        <Form.Control as="textarea" value={message} onChange={(e:any) => setMessage(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onCancel}>Cancel</Button>
                <Button type="submit" form="FeedbackForm">Send</Button>
            </Modal.Footer>
        </Modal>
    )
}