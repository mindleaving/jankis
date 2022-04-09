import { Table } from 'react-bootstrap';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MarkHealthRecordEntryAsSeenCallback } from '../../types/frontendTypes';
import { DiagnosisTableRow } from './DiagnosisTableRow';

interface PatientDiagnosisViewProps {
    personId: string;
    diagnoses: ViewModels.DiagnosisViewModel[];
    onMarkAsResolved: (diagnosisId: string) => void;
    onMarkAsSeen: MarkHealthRecordEntryAsSeenCallback;
}

export const PatientDiagnosesView = (props: PatientDiagnosisViewProps) => {

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
                    <DiagnosisTableRow
                        key={x.id}
                        personId={props.personId}
                        diagnosis={x}
                        onMarkAsResolved={props.onMarkAsResolved}
                        onMarkAsSeen={props.onMarkAsSeen}
                    />
                ))
                : <tr>
                    <td colSpan={5} className="text-center">{resolveText("NoEntries")}</td>
                </tr>}
            </tbody>
        </Table>
    );

}