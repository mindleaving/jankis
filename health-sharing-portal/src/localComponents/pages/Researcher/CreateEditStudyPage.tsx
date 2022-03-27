import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { GenericTypeCreateEditPage } from '../../../sharedCommonComponents/pages/GenericTypeCreateEditPage';
import { QuestionnaireAutocompleteWidget } from '../../../sharedHealthComponents/components/Widgets/QuestionnaireAutocompleteWidget';
import { Models } from '../../types/models';

interface CreateEditStudyPageProps {}

export const CreateEditStudyPage = (props: CreateEditStudyPageProps) => {

    const navigate = useNavigate();

    const studyLoad = async (id: string) => {
        const response = await apiClient.instance!.get(`api/studies/${id}`, {})
        return await response.json();
    };
    const studySubmitter = async (study: Models.Study) => {
        await apiClient.instance!.put(`api/studies/${study.id}`, {}, study);
        navigate(`/study/${study.id}`);
    };

    const uiSchema = {
        inclusionCriteriaQuestionaireIds: {
            items: {
                "ui:widget": QuestionnaireAutocompleteWidget
            }
        },
        exclusionCriteriaQuestionaireIds: {
            items: {
                "ui:widget": QuestionnaireAutocompleteWidget
            }
        }
    }
    
    return (<>
        <GenericTypeCreateEditPage<Models.Study>
            typeName='study'
            uiSchema={uiSchema}
            itemLoader={studyLoad}
            onSubmit={studySubmitter}
        />
        <hr />
        <Row className='text-center mb-3'>
            <Col>
                <Button variant="info" onClick={() => navigate("/create/questionnaire")}>{resolveText("CreateNewQuestionnaire")}</Button>
            </Col>
        </Row>
    </>
    );

}

