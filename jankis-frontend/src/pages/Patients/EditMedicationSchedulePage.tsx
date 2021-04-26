import React from 'react';
import { RouteComponentProps } from 'react-router';
import { MedicationScheduleEditor } from '../../components/Patients/MedicationScheduleEditor';
import { resolveText } from '../../helpers/Globalizer';

interface MedicationScheduleParams {
    scheduleId?: string;
}
interface EditMedicationSchedulePageProps extends RouteComponentProps<MedicationScheduleParams>  {}

export const EditMedicationSchedulePage = (props: EditMedicationSchedulePageProps) => {
    const medicationScheduleId = props.match.params.scheduleId;
    if(!medicationScheduleId) {
        return (<h1>{resolveText('MissingID')}</h1>);
    }

    return (
        <MedicationScheduleEditor
            medicationScheduleId={medicationScheduleId}
        />
    );

}