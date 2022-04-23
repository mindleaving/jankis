import React from 'react';
import { Table } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { formatDate, formatMedicalProcedureCodeAndName } from '../../helpers/Formatters';
import { MarkHealthRecordEntryAsSeenCallback } from '../../types/frontendTypes';

interface PatientMedicalProceduresViewProps {
    personId: string;
    medicalProcedures: Models.Procedures.MedicalProcedure[];
    onMarkAsSeen: MarkHealthRecordEntryAsSeenCallback;
}

export const PatientMedicalProceduresView = (props: PatientMedicalProceduresViewProps) => {

    return (
        <>
            <Table hover>
                <tbody>
                    {props.medicalProcedures.map(medicalProcedure => (
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