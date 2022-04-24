import { useEffect, useState } from 'react';
import { Alert, Button, Col, FormControl, FormLabel, InputGroup, Row, Table } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { MedicationScheduleItemTableRow } from './MedicationScheduleItemTableRow';
import { useNavigate } from 'react-router';
import { addDays } from 'date-fns';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface PatientMedicationViewProps {
    medicationSchedules: Models.Medication.MedicationSchedule[];
    medicationDispensions: Models.Medication.MedicationDispension[];
    onCreateNewMedicationSchedule: () => void;
}

export const PatientMedicationView = (props: PatientMedicationViewProps) => {

    const [ selectedMedicationSchedule, setSelectedMedicationSchedule ] = useState<Models.Medication.MedicationSchedule>();
    const [ medicationChartSeries, setMedicationChartSeries ] = useState<any[]>([{ data: [] }]);
    const [ selectedMedications, setSelectedMedications ] = useState<Models.Medication.MedicationScheduleItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(selectedMedicationSchedule) return;
        if(props.medicationSchedules.length === 0) return;
        setSelectedMedicationSchedule(props.medicationSchedules[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.medicationSchedules ]);
    useEffect(() => {
        if(!selectedMedicationSchedule) return;
        const series = [{
            data: selectedMedicationSchedule.items.flatMap(medication => {
                if(medication.isPaused) {
                    return [];
                }
                return medication.plannedDispensions
                    .filter(dispension => new Date(dispension.timestamp).getTime() > 0)
                    .map(dispension => {
                        const time = new Date(dispension.timestamp).getTime();
                        return (
                            {
                                x: medication.drug.productName,
                                y: [ time, time + 60*60*1000 ]
                            }
                        )
                    });
            })
        }];
        setMedicationChartSeries(series);
    }, [ selectedMedicationSchedule ]);

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
    
    return (
        <>
            <Row className="mt-2">
                <Col>
                </Col>
                <FormLabel column xs="auto">{resolveText('MedicationSchedule')}</FormLabel>
                <Col xs="auto">
                    <InputGroup>
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
                        {selectedMedicationSchedule
                        ? <i className="fa fa-edit clickable m-2" style={{ fontSize: '20px'}} onClick={() => navigate(`/medicationschedules/${selectedMedicationSchedule.id}/edit`)} />
                        : null}
                    </InputGroup>
                </Col>
            </Row>
            {selectedMedicationSchedule
            ? <>
                {selectedMedicationSchedule.items.length > 0
                ? <Chart
                    type="rangeBar"
                    options={chartOptions}
                    series={medicationChartSeries}
                    height={Math.min(380, 100+50*selectedMedicationSchedule.items.length)}
                /> : null}
                {selectedMedicationSchedule.note
                ? <Alert variant="danger">
                    {selectedMedicationSchedule.note}
                </Alert> : null}
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