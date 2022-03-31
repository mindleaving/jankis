import React, { useState } from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from 'react-router-dom';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { formatDate } from '../../helpers/Formatters';

interface PatientDiagnosisViewProps {
    personId: string;
    diagnoses: ViewModels.DiagnosisViewModel[];
    onMarkAsResolved: (diagnosisId: string) => void;
}

export const PatientDiagnosesView = (props: PatientDiagnosisViewProps) => {

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
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
            () => props.onMarkAsResolved(diagnosisId),
            () => setIsSubmitting(false)
        );
    }

    return (
        <Table>
            <thead>
                <tr>
                    <th>{resolveText("ICD11")}</th>
                    <th>{resolveText("ICD10")}</th>
                    <th>{resolveText("Diagnosis_Name")}</th>
                    <th>{resolveText("Diagnosis_Timestamp")}</th>
                    <th>{resolveText("Diagnosis_Resolved")}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {props.diagnoses.length > 0
                ? props.diagnoses.map(x => (
                    <tr key={x.id}>
                        <td>{x.icd11Code}</td>
                        <td>{x.icd10Code}</td>
                        <td>{x.name}</td>
                        <td>{formatDate(new Date(x.timestamp))}</td>
                        <td>
                            {x.hasResolved
                            ? <>
                                <Badge bg='success' className='me-2'>{resolveText("Diagnosis_Resolved")}</Badge>
                                {x.resolvedTimestamp ? <div><small>{formatDate(new Date(x.resolvedTimestamp))}</small></div> : null}
                            </>
                            : <>
                                <AsyncButton 
                                    size="sm" 
                                    variant="success" 
                                    onClick={() => markAsResolved(x.id, x.name)}
                                    activeText={resolveText("Diagnosis_MarkAsResolved")}
                                    executingText={resolveText("Submitting...")}
                                    isExecuting={isSubmitting}
                                />
                            </>}
                        </td>
                        <td>
                            <Button 
                                variant="link" 
                                onClick={() => navigate(`/healthrecord/${props.personId}/edit/diagnosis/${x.id}`)}
                            >
                                {resolveText("Edit...")}
                            </Button>
                        </td>
                    </tr>
                ))
                : <tr>
                    <td colSpan={5} className="text-center">{resolveText("NoEntries")}</td>
                </tr>}
            </tbody>
        </Table>
    );

}