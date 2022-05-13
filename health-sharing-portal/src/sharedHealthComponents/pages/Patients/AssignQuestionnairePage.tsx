import { FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Models } from '../../../localComponents/types/models';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { PatientAutocomplete } from '../../components/Autocompletes/PatientAutocomplete';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid } from 'uuid';
import { QuestionnaireAutocomplete } from '../../components/Autocompletes/QuestionnaireAutocomplete';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import UserContext from '../../../localComponents/contexts/UserContext';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { loadPerson } from '../../redux/slices/personsSlice';
import { addQuestionnaireAnswer } from '../../redux/slices/questionnaireAnswersSlice';
import { ViewModels } from '../../../localComponents/types/viewModels';

interface AssignQuestionnairePageProps {}

export const AssignQuestionnairePage = (props: AssignQuestionnairePageProps) => {

    const { personId } = useParams();
    const user = useContext(UserContext);
    const matchedProfileData = useAppSelector(state => state.persons.items.find(x => x.id === personId));
    const [ person, setPerson ] = useState<Models.Person | undefined>(matchedProfileData);
    const [ questionnaire, setQuestionnaire ] = useState<Models.Interview.Questionnaire>();
    const isStoring = useAppSelector(state => state.questionnaireAnswers.isSubmitting);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(!personId) return;
        dispatch(loadPerson({ personId }));
    }, [ personId ]);

    useEffect(() => {
        if(!person) {
            setPerson(matchedProfileData);
        }
    }, [ matchedProfileData ]);

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
            createdTimestamp: new Date().toISOString() as any,
            timestamp: new Date().toISOString() as any,
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === person.id,
            answers: []
        };
        const answerVM: ViewModels.QuestionnaireAnswersViewModel = {
            id: answer.id,
            answers: answer.answers,
            createdBy: answer.createdBy,
            createdTimestamp: answer.createdTimestamp,
            hasAnswered: false,
            hasBeenSeenBySharer: answer.hasBeenSeenBySharer,
            isVerified: answer.isVerified,
            personId: answer.personId,
            questionCount: questionnaire.questions.length,
            questionnaireDescription: questionnaire.description,
            questionnaireId: questionnaire.id,
            questionnaireLanguage: questionnaire.language,
            questionnaireTitle: questionnaire.title,
            timestamp: answer.timestamp,
            type: answer.type
        };
        dispatch(addQuestionnaireAnswer({
            args: answerVM,
            body: answer,
            onSuccess: () => navigate(-1)
        }));
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