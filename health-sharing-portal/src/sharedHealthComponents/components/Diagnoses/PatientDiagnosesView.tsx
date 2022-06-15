import { Table } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { DiagnosisTableRow } from './DiagnosisTableRow';
import { sortByTimeDescending } from '../../helpers/HealthRecordEntryHelpers';

interface PatientDiagnosisViewProps {
    personId: string;
}

export const PatientDiagnosesView = (props: PatientDiagnosisViewProps) => {

    const diagnoses = useAppSelector(state => state.diagnoses.items.filter(x => x.personId === props.personId));
    const timeSortedDiagnoses = sortByTimeDescending(diagnoses);

    return (
        <Table>
            <thead>
                <tr>
                    <th></th>
                    <th>{resolveText("ICD11")}</th>
                    <th>{resolveText("ICD10")}</th>
                    <th>{resolveText("Diagnosis_Name")}</th>
                    <th>{resolveText("Diagnosis_Timestamp")}</th>
                    <th>{resolveText("Diagnosis_Resolved")}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {timeSortedDiagnoses.length > 0
                ? timeSortedDiagnoses.map(x => (
                    <DiagnosisTableRow
                        key={x.id}
                        diagnosis={x}
                    />
                ))
                : <tr>
                    <td colSpan={7} className="text-center">{resolveText("NoEntries")}</td>
                </tr>}
            </tbody>
        </Table>
    );

}