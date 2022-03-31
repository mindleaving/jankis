import React from 'react';
import { Table } from 'react-bootstrap';
import { formatDate, formatMeasurementType, formatObservationValue } from '../../helpers/Formatters';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { MeasurementType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { groupBy } from '../../../sharedCommonComponents/helpers/CollectionHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface PatientObservationsViewProps {
    observations: Models.Observations.Observation[];
}
interface ObservationDataPoint {
    measurementType: MeasurementType;
    seriesName: string;
    timestamp: Date;
    value: number;
    unit: string;
}
interface Group<T> {
    key: string,
    items: T[]
}
export const PatientObservationsView = (props: PatientObservationsViewProps) => {
    
    const observationDataPoints = props.observations.flatMap((observation): ObservationDataPoint[] => {
        const measurementType = observation.measurementType as MeasurementType;
        if(observation.measurementType === MeasurementType.Pulse) {
            const pulseObservation = observation as Models.Observations.PulseObservation;
            return [{
                measurementType: measurementType,
                seriesName: formatMeasurementType(measurementType),
                timestamp: observation.timestamp,
                value: pulseObservation.bpm,
                unit: '1/min'
            }];
        }
        if(measurementType === MeasurementType.BloodPressure) {
            const bloodPressureObservation = observation as Models.Observations.BloodPressureObservation;
            return [
                {
                    measurementType: measurementType,
                    seriesName: `${formatMeasurementType(measurementType)} - ${resolveText('Systolic')}`,
                    timestamp: observation.timestamp,
                    value: bloodPressureObservation.systolic,
                    unit: 'mmHg'
                },
                {
                    measurementType: measurementType,
                    seriesName: `${formatMeasurementType(measurementType)} - ${resolveText('Diastolic')}`,
                    timestamp: observation.timestamp,
                    value: bloodPressureObservation.diastolic,
                    unit: 'mmHg'
                }
            ];
        }
        if(measurementType === MeasurementType.Temperature) {
            const temperatureObservation = observation as Models.Observations.TemperatureObservation;
            return [{
                measurementType: measurementType,
                seriesName: formatMeasurementType(measurementType),
                timestamp: observation.timestamp,
                value: temperatureObservation.value,
                unit: '°C'
            }];
        }
        const genericObservation = observation as Models.Observations.GenericObservation;
        if(isNaN(parseFloat(genericObservation.value))) {
            return [];
        }
        return [{
            measurementType: measurementType,
            seriesName: formatMeasurementType(measurementType),
            timestamp: observation.timestamp,
            value: parseFloat(genericObservation.value),
            unit: genericObservation.unit ?? ''
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
            const unit = group.items[0].unit;
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
                        text: unit
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
                        <td>{formatDate(new Date(observation.timestamp))}</td>
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