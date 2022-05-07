import { useEffect, useState } from 'react';
import { Models } from '../../../localComponents/types/models';
import { groupBy } from '../../../sharedCommonComponents/helpers/CollectionHelpers';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

interface MedicationDispensionChartProps {
    medicationDispensions: Models.Medication.MedicationDispension[];
    groupBy?: (dispension: Models.Medication.MedicationDispension) => any;
    defaultTimeRangeStart: Date;
    defaultTimeRangeEnd: Date;
}

export const MedicationDispensionChart = (props: MedicationDispensionChartProps) => {

    const [ medicationChartSeries, setMedicationChartSeries ] = useState<any[]>([{ data: [] }]);
    const [ seriesCount, setSeriesCount ] = useState<number>(0);

    useEffect(() => {
        const groupedDispensions = groupBy(props.medicationDispensions, props.groupBy ?? (x => x.drug.id));
        const series = [{
            data: groupedDispensions.flatMap(dispensionGroup => {
                return dispensionGroup.items
                    .filter(dispension => new Date(dispension.timestamp).getTime() > 0)
                    .map(chartPointFromDispension);
            })
        }];
        setMedicationChartSeries(series);
        setSeriesCount(groupedDispensions.length);
    }, [ props.medicationDispensions, props.groupBy ]);

    const chartPointFromDispension = (dispension: Models.Medication.MedicationDispension) => {
        const time = new Date(dispension.timestamp).getTime();
        return (
            {
                x: dispension.drug.productName,
                y: [ time, time + 60*60*1000 ]
            }
        )
    }

    const minTime = props.defaultTimeRangeStart.getTime();
    const maxTime = props.defaultTimeRangeEnd.getTime();
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
        grid: {
            show: true,
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
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
    return (
        <Chart
            type="rangeBar"
            options={chartOptions}
            series={medicationChartSeries}
            height={Math.min(380, 100+50*seriesCount)}
        />
    );

}