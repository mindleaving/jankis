import { useNavigate, useParams } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { DrugForm } from '../../../sharedHealthComponents/components/Drugs/DrugForm';

interface CreateEditDrugPageProps {}

export const CreateEditDrugPage = (props: CreateEditDrugPageProps) => {

    const { drugId } = useParams();
    const navigate = useNavigate();
    
    return (
        <>
            <h1>{resolveText('Drug')}</h1>
            <DrugForm
                drugId={drugId}
                onDrugCreated={() => navigate(-1)}
            />
        </>
    );

}