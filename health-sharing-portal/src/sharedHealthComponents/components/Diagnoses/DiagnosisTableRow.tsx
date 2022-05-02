import { useContext, useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../localComponents/contexts/UserContext';
import { needsHiding } from '../../../localComponents/helpers/HealthRecordEntryHelpers';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { formatDate } from '../../helpers/Formatters';
import { markDiagnosisAsResolved, markDiagnosisAsSeen } from '../../redux/slices/diagnosesSlice';
import { useAppDispatch } from '../../redux/store/healthRecordStore';

interface DiagnosisTableRowProps {
    diagnosis: ViewModels.DiagnosisViewModel;
}

export const DiagnosisTableRow = (props: DiagnosisTableRowProps) => {

    const diagnosis = props.diagnosis;
    const user = useContext(UserContext);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const markAsResolved = async (diagnosisId: string, diagnosisName: string, force: boolean = false) => {
        if(!force) {
            confirmAlert({
                title: resolveText("Diagnosis_ConfirmResolved_Title"),
                message: resolveText("Diagnosis_ConfirmResolved_Message").replace("{0}", diagnosisName),
                closeOnClickOutside: true,
                buttons: [
                    {
                        label: resolveText("Diagnosis_ConfirmResolved_Yes"),
                        onClick: () => markAsResolved(diagnosisId, diagnosisName, true)
                    },
                    {
                        label: resolveText("Diagnosis_ConfirmResolved_No"),
                        onClick: () => {}
                    }
                ]
            });
            return;
        }
        setIsSubmitting(true);
        await sendPostRequest(
            `api/diagnoses/${diagnosisId}/resolve`,
            resolveText("Diagnosis_CouldNotMarkAsResolved"),
            null,
            () => dispatch(markDiagnosisAsResolved(diagnosisId)),
            () => setIsSubmitting(false)
        );
    }
    const unhide = () => dispatch(markDiagnosisAsSeen(diagnosis.id));

    if(needsHiding(diagnosis, user!)) {
        return (
            <tr key={diagnosis.id}>
                <td colSpan={3}>
                    <i className='fa fa-eye-slash clickable' onClick={unhide} />
                </td>
                <td>{formatDate(new Date(diagnosis.timestamp))}</td>
                <td></td>
                <td></td>
            </tr>
        );
    }
    return (
        <tr key={diagnosis.id}>
            <td>{diagnosis.icd11Code}</td>
            <td>{diagnosis.icd10Code}</td>
            <td>{diagnosis.name}</td>
            <td>{formatDate(new Date(diagnosis.timestamp))}</td>
            <td>
                {diagnosis.hasResolved
                ? <>
                    <Badge bg='success' className='me-2'>{resolveText("Diagnosis_Resolved")}</Badge>
                    {diagnosis.resolvedTimestamp ? <div><small>{formatDate(new Date(diagnosis.resolvedTimestamp))}</small></div> : null}
                </>
                : <>
                    <AsyncButton 
                        size="sm" 
                        variant="success" 
                        onClick={() => markAsResolved(diagnosis.id, diagnosis.name)}
                        activeText={resolveText("Diagnosis_MarkAsResolved")}
                        executingText={resolveText("Submitting...")}
                        isExecuting={isSubmitting}
                    />
                </>}
            </td>
            <td>
                <Button 
                    variant="link" 
                    onClick={() => navigate(`/healthrecord/${diagnosis.personId}/edit/diagnosis/${diagnosis.id}`)}
                >
                    {resolveText("Edit...")}
                </Button>
            </td>
        </tr>
    );

}