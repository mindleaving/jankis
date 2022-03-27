import React from 'react';
import { Badge, Table } from 'react-bootstrap';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate } from '../../helpers/Formatters';

interface PatientDiagnosisViewProps {
    diagnoses: ViewModels.DiagnosisViewModel[];
}

export const PatientDiagnosesView = (props: PatientDiagnosisViewProps) => {

    return (
        <Table>
            <thead>
                <tr>
                    <th>{resolveText("ICD11")}</th>
                    <th>{resolveText("Diagnosis_Name")}</th>
                    <th>{resolveText("Diagnosis_Timestamp")}</th>
                    <th>{resolveText("Diagnosis_Resolved")}</th>
                </tr>
            </thead>
            <tbody>
                {props.diagnoses.length > 0
                ? props.diagnoses.map(x => (
                    <tr key={x.id}>
                        <td>
                            {x.icd11Code}
                            {x.icd10Code ? <small>{resolveText("ICD10")}: {x.icd10Code}</small> : null}
                        </td>
                        <td>{x.name}</td>
                        <td>{formatDate(new Date(x.timestamp))}</td>
                        <td>{x.hasResolved
                        ? <>
                            <Badge bg='success'>{resolveText("Diagnosis_Resolved")}</Badge>
                            <small>{formatDate(new Date(x.resolvedTimestamp!))}</small>
                        </>
                        : null}</td>
                    </tr>
                ))
                : <tr>
                    <td colSpan={4} className="text-center">{resolveText("NoEntries")}</td>
                </tr>}
            </tbody>
        </Table>
    );

}