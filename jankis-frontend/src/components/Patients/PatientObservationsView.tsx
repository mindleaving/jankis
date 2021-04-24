import React from 'react';
import { Table } from 'react-bootstrap';
import { formatMeasurementType, formatObservationValue } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { MeasurementType } from '../../types/enums.d';
import { Models } from '../../types/models';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { groupBy } from '../../helpers/CollectionHelpers';

interface PatientObservationsViewProps {
    observations: Models.Observation[];
}
interface ObservationDataPoint {
    measurementType: MeasurementType;
    seriesName: string;
    timestamp: Date;
    value: number;
}
interface Group<T> {
    key: string,
    items: T[]
}
export const PatientObservationsView = (props: PatientObservationsViewProps) => {
    
    const observationDataPoints = props.observations.flatMap((observation): ObservationDataPoint[] => {
        const measurementType = observation.measurementType as MeasurementType;
        if(observation.measurementType === MeasurementType.Pulse) {
            const pulseObservation = observation as Models.PulseObservation;
            return [{
                measurementType: measurementType,
                seriesName: formatMeasurementType(measurementType),
                timestamp: observation.timestamp,
                value: pulseObservation.bpm
            }];
        }
        if(measurementType === MeasurementType.BloodPressure) {
            const bloodPressureObservation = observation as Models.BloodPressureObservation;
            return [
                {
                    measurementType: measurementType,
                    seriesName: `${formatMeasurementType(measurementType)} - ${resolveText('Systolic')}`,
                    timestamp: observation.timestamp,
                    value: bloodPressureObservation.systolic
                },
                {
                    measurementType: measurementType,
                    seriesName: `${formatMeasurementType(measurementType)} - ${resolveText('Diastolic')}`,
                    timestamp: observation.timestamp,
                    value: bloodPressureObservation.diastolic
                }
            ];
        }
        if(measurementType === MeasurementType.Temperature) {
            const temperatureObservation = observation as Models.TemperatureObservation;
            return [{
                measurementType: measurementType,
                seriesName: formatMeasurementType(measurementType),
                timestamp: observation.timestamp,
                value: temperatureObservation.value
            }];
        }
        const genericObservation = observation as Models.GenericObservation;
        if(isNaN(parseFloat(genericObservation.value))) {
            return [];
        }
        return [{
            measurementType: measurementType,
            seriesName: formatMeasurementType(measurementType),
            timestamp: observation.timestamp,
            value: parseFloat(genericObservation.value)
        }];
    });
    const groupedObservations = groupBy(observationDataPoints, x => x.seriesName);
    const observationsChartData = groupedObservations
        .map(group => ({
            name: group.key,
            data: group.items.map(observation => (
                {
                    x: new Date(observation.timestamp).getTime(),
                    y: observation.value
                }
            ))
        }));
    const getUnitForMeasurementType = (measurementType: MeasurementType) => {
        switch(measurementType) {
            case MeasurementType.Pulse:
                return '1/min';
            case MeasurementType.BloodPressure:
                return 'mmHg';
            case MeasurementType.Temperature:
                return '°C';
            case MeasurementType.OxygenSaturation:
                return '%';
            default:
                throw new Error(`Unsupported measurement type '${measurementType}' for charting`);
        }
    }
    const getYMinForMeasurementType = (measurementType: MeasurementType) => {
        switch(measurementType) {
            case MeasurementType.Temperature:
                return 34;
        }
        return undefined;
    }
    const getYMaxForMeasurementType = (measurementType: MeasurementType) => {
        switch(measurementType) {
            case MeasurementType.Temperature:
                return 42;
        }
        return undefined;
    }
    const generateYAxes = (observationGroups: Group<ObservationDataPoint>[]) => {
        const measurementTypeSeriesNameMap: { [key: string]: string } = {};
        const yAxesOptions: ApexYAxis[] = [];
        for (const group of observationGroups) {
            const seriesName = group.key;
            const measurementType = group.items[0].measurementType;
            const existingYAxisName = measurementTypeSeriesNameMap[measurementType];
            if(existingYAxisName) {
                yAxesOptions.push({
                    seriesName: existingYAxisName,
                    show: false
                });
            } else {
                yAxesOptions.push({
                    seriesName: seriesName,
                    title: {
                        text: getUnitForMeasurementType(measurementType)
                    },
                    min: getYMinForMeasurementType(measurementType),
                    max: getYMaxForMeasurementType(measurementType),
                    forceNiceScale: true
                });
                measurementTypeSeriesNameMap[measurementType] = seriesName;
            }
        }
        return yAxesOptions;
    }
    const getColorForMeasurementType = (measurementType: MeasurementType) => {
        switch(measurementType) {
            case MeasurementType.Pulse:
                return '#c00';
            case MeasurementType.BloodPressure:
                return '#08f';
            case MeasurementType.Temperature:
                return '#090';
            default:
                return '#333'
        }
    }
    const chartOptions: ApexOptions = {
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
        yaxis: generateYAxes(groupedObservations),
        markers: {
            size: 8
        },
        colors: groupedObservations.map(group => getColorForMeasurementType(group.items[0].measurementType))
    }

    return (<>
        <Chart
            options={chartOptions}
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