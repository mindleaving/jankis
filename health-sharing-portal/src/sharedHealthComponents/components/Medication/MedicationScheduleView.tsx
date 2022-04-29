import { ApexOptions } from 'apexcharts';
import { addDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Alert, FormCheck, Table } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MedicationScheduleItemTableRow } from '../Patients/MedicationScheduleItemTableRow';
import Chart from 'react-apexcharts';

interface MedicationScheduleViewProps {
    medicationSchedule: Models.Medication.MedicationSchedule;
}

export const MedicationScheduleView = (props: MedicationScheduleViewProps) => {

    const [ medicationChartSeries, setMedicationChartSeries ] = useState<any[]>([{ data: [] }]);
    const [ selectedMedications, setSelectedMedications ] = useState<Models.Medication.MedicationScheduleItem[]>([]);
    
    useEffect(() => {
        if(!props.medicationSchedule) {
            return;
        }
        const series = [{
            data: props.medicationSchedule.items.flatMap(medication => {
                if(medication.isPaused) {
                    return [];
                }
                return medication.plannedDispensions
                    .filter(dispension => new Date(dispension.timestamp).getTime() > 0)
                    .map(chartPointFromDispension);
            })
        }];
        setMedicationChartSeries(series);
    }, [ props.medicationSchedule ]);

    useEffect(() => {
        const scheduleItems = selectedMedications.length > 0
            ? selectedMedications
            : props.medicationSchedule.items;
        const series = [{
            data: scheduleItems.flatMap(medication => {
                if(medication.isPaused) {
                    return [];
                }
                return medication.plannedDispensions
                    .filter(dispension => new Date(dispension.timestamp).getTime() > 0)
                    .map(chartPointFromDispension);
            })
        }];
        setMedicationChartSeries(series);
    }, [ selectedMedications ]);

    const chartPointFromDispension = (dispension: Models.Medication.MedicationDispension) => {
        const time = new Date(dispension.timestamp).getTime();
        return (
            {
                x: dispension.drug.productName,
                y: [ time, time + 60*60*1000 ]
            }
        )
    }

    const now = new Date();
    const minTime = addDays(now, -2).getTime();
    const maxTime = addDays(now, 3).getTime();
    const chartOptions: ApexOptions = {
        chart: {
            type: 'rangeBar',
            events: {
                beforeResetZoom: (chart, options) => {
                    return {
                        xaxis: {
                            min: minTime,
                            max: maxTime
                        }
                    };
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        xaxis: {
            type: 'datetime',
            min: minTime,
            max: maxTime
        },
        tooltip: {
            x: {
                format: 'dd MMM HH:mm'
            }
        }
    };
    const addMedicationToSelection = (medication: Models.Medication.MedicationScheduleItem) => {
        if(selectedMedications.includes(medication)) return;
        setSelectedMedications(selectedMedications.concat(medication));
    }
    const removeMedicationFromSelection = (medication: Models.Medication.MedicationScheduleItem) => {
        setSelectedMedications(selectedMedications.filter(x => x !== medication));
    }
    const toggleSelectAll = () => {
        if(selectedMedications.length === props.medicationSchedule.items.length) {
            setSelectedMedications([]);
        } else {
            setSelectedMedications(props.medicationSchedule.items);
        }
    }
    
    return (
        <>
            {props.medicationSchedule.items.length > 0
            ? <Chart
                type="rangeBar"
                options={chartOptions}
                series={medicationChartSeries}
                height={Math.min(380, 100+50*props.medicationSchedule.items.length)}
            /> : null}
            {props.medicationSchedule.note
            ? <Alert variant="danger">
                {props.medicationSchedule.note}
            </Alert> : null}
            <Table>
                <thead>
                    <tr>
                        <th>
                            <FormCheck
                                checked={selectedMedications.length === props.medicationSchedule.items.length}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th>{resolveText('MedicationScheduleItem_DrugName')}</th>
                        <th>{resolveText('MedicationScheduleItem_DispensionsToday')}</th>
                        <th>{resolveText('MedicationScheduleItem_DispensionsTomorrow')}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.medicationSchedule.items.map(medication => {
                        const isSelected = selectedMedications.includes(medication);
                        return (
                            <MedicationScheduleItemTableRow
                                key={medication.drug.id}
                                medication={medication}
                                isSelected={isSelected}
                                onSelectionChanged={isSelected => isSelected ? addMedicationToSelection(medication) : removeMedicationFromSelection(medication)}
                            />
                        );
                    })}
                </tbody>
            </Table>
        </>
    );

}