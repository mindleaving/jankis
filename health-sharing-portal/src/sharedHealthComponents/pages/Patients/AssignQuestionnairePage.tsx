import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Models } from '../../../localComponents/types/models';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { PatientAutocomplete } from '../../components/Autocompletes/PatientAutocomplete';
import { NotificationManager } from 'react-notifications';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { v4 as uuid } from 'uuid';
import { QuestionnaireAutocomplete } from '../../components/Autocompletes/QuestionnaireAutocomplete';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import UserContext from '../../../localComponents/contexts/UserContext';

interface AssignQuestionnairePageProps {}

export const AssignQuestionnairePage = (props: AssignQuestionnairePageProps) => {

    const { personId } = useParams();
    const user = useContext(UserContext);
    const [ person, setPerson ] = useState<Models.Person>();
    const [ questionnaire, setQuestionnaire ] = useState<Models.Interview.Questionnaire>();
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!personId) return;
        const loadProfileData = buildLoadObjectFunc<Models.Person>(
            `api/persons/${personId}`, {},
            resolveText('Patient_CouldNotLoad'),
            setPerson
        );
        loadProfileData();
    }, [ personId ]);

    const store = async (e: FormEvent) => {
        e.preventDefault();
        if(!questionnaire) {
            NotificationManager.error(resolveText('Document_NoFileSelected'));
            return;
        }
        if(!person) {
            NotificationManager.error(resolveText('PleaseSelect_Patient'));
            return;
        }
        const answer: Models.Interview.QuestionnaireAnswers = {
            id: uuid(),
            type: HealthRecordEntryType.Questionnaire,
            personId: person.id,
            questionnaireId: questionnaire.id,
            createdBy: user!.accountId,
            createdTimestamp: new Date(),
            timestamp: new Date(),
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === person.id,
            answers: []
        };
        setIsStoring(true);
        await sendPostRequest(
            `api/questionnaires/${questionnaire.id}/answers`,
            resolveText("QuestionnaireAnswers_CouldNotCreate"),
            answer,
            () => navigate(-1),
            () => {},
            () => setIsStoring(false)
        );
    }
    
    return (
        <>
            <Form onSubmit={store}>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Patient')}</FormLabel>
                    <Col>
                        <PatientAutocomplete
                            value={person}
                            onChange={setPerson}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Questionnaire')}</FormLabel>
                    <Col>
                        <QuestionnaireAutocomplete
                            value={questionnaire}
                            onChange={setQuestionnaire}
                        />
                    </Col>
                </FormGroup>
                <StoreButton
                    type="submit"
                    isStoring={isStoring}
                    disabled={!person || !questionnaire}
                />
            </Form>
            <hr />
            <Row className='text-center mb-3'>
                <Col>
                    <Button variant="info" onClick={() => navigate("/create/questionnaire")}>{resolveText("CreateNewQuestionnaire")}</Button>
                </Col>
            </Row>
        </>
    );

}