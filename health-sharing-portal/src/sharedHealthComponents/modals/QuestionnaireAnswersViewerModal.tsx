import React from 'react';
import { Modal } from 'react-bootstrap';
import { ViewModels } from '../../localComponents/types/viewModels';
import { QuestionnaireAnswersViewer } from '../components/QuestionnaireAnswers/QuestionnaireAnswersViewer';

interface QuestionnaireAnswersViewerModalProps {
    show: boolean;
    questionnaireAnswers: ViewModels.QuestionnaireAnswersViewModel;
    onRequestClose: () => void;
}

export const QuestionnaireAnswersViewerModal = (props: QuestionnaireAnswersViewerModalProps) => {

    return (
        <Modal show={props.show} size="lg" onHide={props.onRequestClose}>
            <Modal.Header closeButton>{props.questionnaireAnswers.questionnaireTitle}</Modal.Header>
            <Modal.Body>
                <QuestionnaireAnswersViewer
                    answers={props.questionnaireAnswers}
                />
            </Modal.Body>
        </Modal>
    );

}