import React, { useState } from 'react';
import { Col, FormControl, Row } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface PatientMedicationViewProps {
    medicationSchedules: Models.MedicationSchedule[];
    medicationDispensions: Models.MedicationDispension[];
}

export const PatientMedicationView = (props: PatientMedicationViewProps) => {

    const [ selectedMedicationSchedule, setSelectedMedicationSchedule ] = useState<Models.MedicationSchedule | undefined>(
        props.medicationSchedules.length > 0 ? props.medicationSchedules[props.medicationSchedules.length-1] : undefined
    );

    const medicationSeries = [
        {
            data: [
                {
                    x: 'Aspirin',
                    y: [ '2021-04-18T08:00Z', '2021-04-18T09:00Z'].map(x => new Date(x).getTime())
                    // [
                    //     ['2021-04-18T08:00Z', '2021-04-18T09:00Z'], 
                    //     ['2021-04-18T12:00Z', '2021-04-18T13:00Z'], 
                    //     ['2021-04-19T08:00Z', '2021-04-19T09:00Z'], 
                    //     ['2021-04-19T12:00Z', '2021-04-19T12:00Z']
                    // ]
                },
                {
                    x: 'Aspirin',
                    y: [ '2021-04-18T12:00Z', '2021-04-18T13:00Z'].map(x => new Date(x).getTime())
                    // [
                    //     ['2021-04-18T08:00Z', '2021-04-18T09:00Z'], 
                    //     ['2021-04-18T12:00Z', '2021-04-18T13:00Z'], 
                    //     ['2021-04-19T08:00Z', '2021-04-19T09:00Z'], 
                    //     ['2021-04-19T12:00Z', '2021-04-19T12:00Z']
                    // ]
                },
                {
                    x: 'Furosemide',
                    y: ['2021-04-18T08:00Z', '2021-04-18T09:00Z'].map(x => new Date(x).getTime())
                    // [
                    //     ['2021-04-18T08:00Z', '2021-04-18T09:00Z'], 
                    //     ['2021-04-18T12:00Z', '2021-04-18T13:00Z'], 
                    //     ['2021-04-19T08:00Z', '2021-04-19T09:00Z'], 
                    //     ['2021-04-19T12:00Z', '2021-04-19T12:00Z']
                    // ]
                },
                {
                    x: 'Lithium',
                    y: ['2021-04-18T08:00Z', '2021-04-18T09:00Z'].map(x => new Date(x).getTime())
                    // [
                    //     ['2021-04-18T08:00Z', '2021-04-18T09:00Z'], 
                    //     ['2021-04-18T21:00Z', '2021-04-18T22:00Z'], 
                    //     ['2021-04-19T08:00Z', '2021-04-19T09:00Z'], 
                    //     ['2021-04-19T21:00Z', '2021-04-19T22:00Z']
                    // ]
                }
            ]
        }
    ];
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
    return (
        <>
            <Row>
                <Col>
                </Col>
                <Col xs="auto">
                    <FormControl
                        as="select"
                        value={selectedMedicationSchedule?.id ?? ''}
                        onChange={(e:any) => setSelectedMedicationSchedule(props.medicationSchedules.find(x => x.id === e.target.value))}
                    >
                        {props.medicationSchedules.map((medicationSchedule,index) => (
                            <option key={medicationSchedule.id} value={medicationSchedule.id}>
                                {medicationSchedule.name ?? `${resolveText('MedicationSchedule')} #${index}`}
                            </option>
                        ))}
                    </FormControl>
                </Col>
            </Row>
            <Chart
                type="rangeBar"
                options={chartOptions}
                series={medicationSeries}
                height="380"
            />
        </>
    );

}