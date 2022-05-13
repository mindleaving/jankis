import { Table } from 'react-bootstrap';
import { useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { MedicalProcedureTableRow } from './MedicalProcedureTableRow';

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
                        <MedicalProcedureTableRow
                            key={medicalProcedure.id}
                            medicalProcedure={medicalProcedure}
                        />
                    ))}
                </tbody>
            </Table>
        </>
    );

}