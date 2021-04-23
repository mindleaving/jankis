import React from 'react';
import { Table } from 'react-bootstrap';
import { formatMeasurementType, formatObservationValue } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { MeasurementType } from '../../types/enums.d';
import { Models } from '../../types/models';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface PatientObservationsViewProps {
    observations: Models.Observation[];
}

export const PatientObservationsView = (props: PatientObservationsViewProps) => {
    
    const pulseObservations = props.observations.filter(x => x.measurementType === MeasurementType.Pulse);
    const bloodPressureObservations = props.observations.filter(x => x.measurementType === MeasurementType.BloodPressure);
    
    const observationsChartData = [
        {
            name: `${formatMeasurementType(MeasurementType.Pulse)}`,
            data: [
                {x: new Date('2021-04-18T09:00Z').getTime(), y: 48},
                {x: new Date('2021-04-18T17:00Z').getTime(), y: 52},
                {x: new Date('2021-04-19T10:00Z').getTime(), y: 53},
                {x: new Date('2021-04-20T05:00Z').getTime(), y: 49},
                {x: new Date('2021-04-20T10:00Z').getTime(), y: 61},
            ]
        },
        {
            name: `${formatMeasurementType(MeasurementType.BloodPressure)} - ${resolveText('Systolic')}`,
            data: [
                {x: new Date('2021-04-18T09:00Z').getTime(), y: 120},
                {x: new Date('2021-04-18T17:00Z').getTime(), y: 120},
                {x: new Date('2021-04-19T10:00Z').getTime(), y: 110},
                {x: new Date('2021-04-20T05:00Z').getTime(), y: 120},
                {x: new Date('2021-04-20T10:00Z').getTime(), y: 125},
            ]
        },
        {
            name: `${formatMeasurementType(MeasurementType.BloodPressure)} - ${resolveText('Diastolic')}`,
            data: [
                {x: new Date('2021-04-18T09:00Z').getTime(), y: 70},
                {x: new Date('2021-04-18T17:00Z').getTime(), y: 75},
                {x: new Date('2021-04-19T10:00Z').getTime(), y: 75},
                {x: new Date('2021-04-20T05:00Z').getTime(), y: 90},
                {x: new Date('2021-04-20T10:00Z').getTime(), y: 80},
            ]
        },
        {
            name: `${formatMeasurementType(MeasurementType.Temperature)}`,
            data: [
                {x: new Date('2021-04-18T09:00Z').getTime(), y: 36.9},
                {x: new Date('2021-04-18T17:00Z').getTime(), y: 37.1},
                {x: new Date('2021-04-19T10:00Z').getTime(), y: 37.1},
                {x: new Date('2021-04-20T05:00Z').getTime(), y: 37.5},
                {x: new Date('2021-04-20T10:00Z').getTime(), y: 37.0},
            ]
        }
    ];
    const pulseChartOptions: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: {
                show: true
            },
            zoom: {
                type: 'xy'
            }
        },
        tooltip: {
            x: {
                format: 'dd MMM HH:mm'
            }
        },
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            }
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: [{
            seriesName: observationsChartData[0].name,
            title: {
                text: '1/min'
            },
            forceNiceScale: true
        },
        {
            seriesName: observationsChartData[1].name,
            title: {
                text: 'mmHg'
            },
            forceNiceScale: true
        },
        {
            seriesName: observationsChartData[1].name,
            show: false
        },
        {
            seriesName: observationsChartData[3].name,
            title: {
                text: '°C'
            },
            min: 34,
            max: 42
        }],
        markers: {
            size: 8
        },
        colors: [ '#f00', '#00f', '#00f', '#0f0' ]
    }

    return (<>
        <Chart
            options={pulseChartOptions}
            series={observationsChartData}
            height="380px"
        />
        <Table>
            <thead>
                <tr>
                    <th>{resolveText('Observation_Timestamp')}</th>
                    <th>{resolveText('Observation_MeausurementType')}</th>
                    <th>{resolveText('Observation_Value')}</th>
                    <th>{resolveText('Observation_CreatedBy')}</th>
                </tr>
            </thead>
            <tbody>
                {props.observations.map(observation => (
                    <tr key={observation.id}>
                        <td>{new Date(observation.timestamp).toLocaleString()}</td>
                        <td>{formatMeasurementType(observation.measurementType)}</td>
                        <td>{formatObservationValue(observation)}</td>
                        <td>{observation.createdBy}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    );

}