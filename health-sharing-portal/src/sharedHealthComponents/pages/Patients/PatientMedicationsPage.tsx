import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Models } from '../../../localComponents/types/models';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { MedicationScheduleEditor } from '../../components/Medication/MedicationScheduleEditor';

interface PatientMedicationsPageProps {}

export const PatientMedicationsPage = (props: PatientMedicationsPageProps) => {

    const { personId } = useParams();

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ medicationSchedules, setMedicationSchedules ] = useState<Models.Medication.MedicationSchedule[]>([]);
    const [ selectedMedicationSchedule, setSelectedMedicationSchedule ] = useState<Models.Medication.MedicationSchedule>();

    useEffect(() => {
        setIsLoading(true);
        const loadMedicationSchedules = buildLoadObjectFunc<Models.Medication.MedicationSchedule[]>(
            `api/patients/${personId}/medicationschedules`,
            {},
            resolveText('MedicationSchedules_CouldNotLoad'),
            setMedicationSchedules,
            () => setIsLoading(false)
        );
        loadMedicationSchedules();
    }, [ personId ]);

    if(!personId) {
        return (<h1>{resolveText('MissingID')}</h1>);
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <h1>{resolveText('MedicationSchedule')}</h1>
            <RowFormGroup
                label={resolveText('MedicationSchedules')}
                as="select"
                value={selectedMedicationSchedule?.id ?? ''}
                onChange={(e:any) => setSelectedMedicationSchedule(medicationSchedules.find(x => x.id === e.target.value))}
            >
                <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                {medicationSchedules.map((medicationSchedule,index) => (
                    <option key={medicationSchedule.id} value={medicationSchedule.id}>{medicationSchedule.name ?? `${resolveText('MedicationSchedule')} #${index+1}`}</option>
                ))}
            </RowFormGroup>
            {selectedMedicationSchedule
            ? <MedicationScheduleEditor
                medicationScheduleId={selectedMedicationSchedule.id}
            />
            : null}
        </>
    );

}