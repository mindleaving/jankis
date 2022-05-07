import React from 'react';
import { useParams } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MedicationScheduleEditor } from '../../components/Medication/MedicationScheduleEditor';

interface EditMedicationSchedulePageProps  {}

export const EditMedicationSchedulePage = (props: EditMedicationSchedulePageProps) => {
    const { scheduleId } = useParams();

    if(!scheduleId) {
        return (<h1>{resolveText('MissingID')}</h1>);
    }

    return (
        <MedicationScheduleEditor
            medicationScheduleId={scheduleId}
        />
    );

}