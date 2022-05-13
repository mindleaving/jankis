import { useContext } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../localComponents/contexts/UserContext';
import { needsHiding } from '../../../localComponents/helpers/HealthRecordEntryHelpers';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate } from '../../helpers/Formatters';
import { deleteDiagnosis, markDiagnosisAsResolved, markDiagnosisAsSeen } from '../../redux/slices/diagnosesSlice';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { openConfirmDeleteAlert } from '../../../sharedCommonComponents/helpers/AlertHelpers';

interface DiagnosisTableRowProps {
    diagnosis: ViewModels.DiagnosisViewModel;
}

export const DiagnosisTableRow = (props: DiagnosisTableRowProps) => {

    const diagnosis = props.diagnosis;
    const user = useContext(UserContext);
    const isSubmitting = useAppSelector(x => x.diagnoses.isSubmitting);
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
        dispatch(markDiagnosisAsResolved({
            args: diagnosisId
        }));
    }
    const unhide = () => dispatch(markDiagnosisAsSeen({ args: diagnosis.id }));
    const dispatchDeleteDiagnosis = () => {
        openConfirmDeleteAlert(
            `${diagnosis.name} (${formatDate(new Date(diagnosis.timestamp))})`,
            resolveText("Diagnosis_Delete_Title"),
            resolveText("Diagnosis_Delete_Message"),
            () => dispatch(deleteDiagnosis({ args: diagnosis.id }))
        );
    }

    if(needsHiding(diagnosis, user!)) {
        return (
            <tr key={diagnosis.id}>
                <td></td>
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
            <td>
                <i
                    className='fa fa-trash red clickable'
                    onClick={dispatchDeleteDiagnosis}
                />
            </td>
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