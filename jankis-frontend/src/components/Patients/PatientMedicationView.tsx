import React, { useEffect, useState } from 'react';
import { Button, Col, FormCheck, FormControl, FormLabel, Row, Table } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { MedicationScheduleItemTableRow } from './MedicationScheduleItemTableRow';
import { MedicationModal } from '../../modals/MedicationModal';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';

interface PatientMedicationViewProps {
    medicationSchedules: Models.MedicationSchedule[];
    medicationDispensions: Models.MedicationDispension[];
    onCreateNewMedicationSchedule: () => void;
}

export const PatientMedicationView = (props: PatientMedicationViewProps) => {

    const [ selectedMedicationSchedule, setSelectedMedicationSchedule ] = useState<Models.MedicationSchedule>();
    const [ medicationChartSeries, setMedicationChartSeries ] = useState<any[]>([{ data: [] }]);
    const [ selectedMedications, setSelectedMedications ] = useState<Models.MedicationScheduleItem[]>([]);
    const [ showMedicationModal, setShowMedicationModal] = useState<boolean>(false);

    useEffect(() => {
        if(selectedMedicationSchedule) return;
        if(props.medicationSchedules.length === 0) return;
        setSelectedMedicationSchedule(props.medicationSchedules[0]);
    }, [ props.medicationSchedules ]);
    useEffect(() => {
        if(!selectedMedicationSchedule) return;
        const series = selectedMedicationSchedule.items.map(medication => (
            {
                data: medication.dispensions.map(dispension => {
                    const time = new Date(dispension.timestamp).getTime();
                    return (
                        {
                            x: medication.drug.productName,
                            y: [ time, time + 60*60*1000 ]
                        }
                    )
                })
            }
        ));
        setMedicationChartSeries(series);
    }, [ selectedMedicationSchedule ]);

    const chartOptions: ApexOptions = {
        chart: {
            type: 'rangeBar'
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        xaxis: {
            type: 'datetime'
        },
        tooltip: {
            x: {
                format: 'dd MMM HH:mm'
            }
        }
    };
    const addMedicationToSelection = (medication: Models.MedicationScheduleItem) => {
        if(selectedMedications.includes(medication)) return;
        setSelectedMedications(selectedMedications.concat(medication));
    }
    const removeMedicationFromSelection = (medication: Models.MedicationScheduleItem) => {
        setSelectedMedications(selectedMedications.filter(x => x !== medication));
    }
    const addMedicationToSchedule = async (medication: Models.MedicationScheduleItem) => {
        if(!selectedMedicationSchedule) return;
        buidlAndStoreObject<Models.MedicationScheduleItem>(
            `api/medicationschedule/${selectedMedicationSchedule.id}/items`,
            resolveText('Medication_SuccessfullyStored'),
            resolveText('Medication_CouldNotStore'),
            () => medication
        );
        setSelectedMedicationSchedule({
            ...selectedMedicationSchedule,
            items: selectedMedicationSchedule.items.concat(medication)
        });
    }
    return (
        <>
            <Row className="mt-2">
                <Col>
                </Col>
                <FormLabel column xs="auto">{resolveText('MedicationSchedule')}</FormLabel>
                <Col xs="auto">
                    <FormControl
                        as="select"
                        value={selectedMedicationSchedule?.id ?? ''}
                        onChange={(e:any) => setSelectedMedicationSchedule(props.medicationSchedules.find(x => x.id === e.target.value))}
                        style={{ minWidth: '100px'}}
                    >
                        {props.medicationSchedules.map((medicationSchedule,index) => (
                            <option key={medicationSchedule.id} value={medicationSchedule.id}>
                                {medicationSchedule.name ?? `${resolveText('MedicationSchedule')} #${index}`}
                            </option>
                        ))}
                    </FormControl>
                </Col>
            </Row>
            {selectedMedicationSchedule
            ? <>
                <Chart
                    type="rangeBar"
                    options={chartOptions}
                    series={medicationChartSeries}
                    height="380"
                />
                <Table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>{resolveText('MedicationScheduleItem_DrugName')}</th>
                            <th>{resolveText('MedicationScheduleItem_DispensionsToday')}</th>
                            <th>{resolveText('MedicationScheduleItem_DispensionsTomorrow')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedMedicationSchedule.items.map(medication => {
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
                <Row>
                    <Col className="text-center">
                        <Button onClick={() => setShowMedicationModal(true)}>{resolveText('Medication_Add')}</Button>
                    </Col>
                </Row>
                <MedicationModal
                    show={showMedicationModal}
                    onMedicationAdded={addMedicationToSchedule}
                    onClose={() => setShowMedicationModal(false)}
                />
            </>
            : <Row>
                <Col className="text-center">
                    {resolveText('MedicationSchedule_NoneSelected')}
                    <div>
                        <Button onClick={props.onCreateNewMedicationSchedule} size="lg">{resolveText('CreateNew')}</Button>
                    </div>
                </Col>
            </Row>}
        </>
    );

}