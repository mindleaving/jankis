import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Models } from '../../types/models';

interface PatientTestResultsViewProps {
    testResults: Models.DiagnosticTestResult[];
}

export const PatientTestResultsView = (props: PatientTestResultsViewProps) => {

    const chartSeries: any[] = [];
    const chartOptions: ApexOptions = {
        chart: {
            type: 'line'
        },
        xaxis: {
            type: 'datetime'
        }
    };
    return (
        <>
            <Chart
                options={chartOptions}
                series={chartSeries}
                height={400}
            />
        </>
    );

}