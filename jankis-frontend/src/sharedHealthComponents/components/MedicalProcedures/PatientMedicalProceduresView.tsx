import React from 'react';
import { Table } from 'react-bootstrap';
import { formatDate, formatMedicalProcedureCodeAndName } from '../../helpers/Formatters';
import { useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';

interface PatientMedicalProceduresViewProps {
    personId: string;
}

export const PatientMedicalProceduresView = (props: PatientMedicalProceduresViewProps) => {

    const medicalProcedures = useAppSelector(state => state.medicalProcedures.items.filter(x => x.personId === props.personId));

    return (
        <>
            <Table hover>
                <tbody>
                    {medicalProcedures.map(medicalProcedure => (
                        <tr key={medicalProcedure.id}>
                            <td>
                                <strong>{formatMedicalProcedureCodeAndName(medicalProcedure)}</strong>
                                <div><small>{formatDate(new Date(medicalProcedure.timestamp))}</small></div>
                            </td>
                            <td>
                                <small>{medicalProcedure.note}</small>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );

}