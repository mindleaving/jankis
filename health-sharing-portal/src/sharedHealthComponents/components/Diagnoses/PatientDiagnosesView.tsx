import { Table } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { useAppSelector } from '../../redux/store/healthRecordStore';
import { DiagnosisTableRow } from './DiagnosisTableRow';

interface PatientDiagnosisViewProps {
    personId: string;
}

export const PatientDiagnosesView = (props: PatientDiagnosisViewProps) => {

    const diagnoses = useAppSelector(state => state.diagnoses.items.filter(x => x.personId === props.personId));

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
                {diagnoses.length > 0
                ? diagnoses.map(x => (
                    <DiagnosisTableRow
                        key={x.id}
                        diagnosis={x}
                    />
                ))
                : <tr>
                    <td colSpan={5} className="text-center">{resolveText("NoEntries")}</td>
                </tr>}
            </tbody>
        </Table>
    );

}