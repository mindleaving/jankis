import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { RowFormGroup } from '../../components/RowFormGroup';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { PatientParams } from '../../types/frontendTypes';
import { Models } from '../../types/models';

interface PatientMedicationsPageProps extends RouteComponentProps<PatientParams> {}

export const PatientMedicationsPage = (props: PatientMedicationsPageProps) => {

    const patientId = props.match.params.patientId;

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ medicationSchedules, setMedicationSchedules ] = useState<Models.MedicationSchedule[]>([]);
    const [ selectedMedicationSchedule, setSelectedMedicationSchedule ] = useState<Models.MedicationSchedule>();

    useEffect(() => {
        setIsLoading(true);
        const loadMedicationSchedules = buildLoadObjectFunc<Models.MedicationSchedule[]>(
            `api/patients/${patientId}/medicationschedules`,
            {},
            resolveText('MedicationSchedules_CouldNotLoad'),
            setMedicationSchedules,
            () => setIsLoading(false)
        );
        loadMedicationSchedules();
    }, [ patientId ]);

    if(!patientId) {
        return (<h1>{resolveText('MissingID')}</h1>);
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
        </>
    );

}