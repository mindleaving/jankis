import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { ViewModels } from '../../types/viewModels';
import { Models } from '../../types/models';
import { formatBed, formatPerson } from '../../helpers/Formatters';
import { addDays, addYears } from 'date-fns/esm';
import { BedState } from '../../types/enums.d';
import { resolveText } from '../../helpers/Globalizer';


interface BedOccupancyTimelineViewProps {
    institution: ViewModels.InstitutionViewModel;
    bedOccupancies: Models.BedOccupancy[];
}

export const BedOccupancyTimelineView = (props: BedOccupancyTimelineViewProps) => {

    const now = new Date();
    const nowTicks = now.getTime();
    const bedCount = props.institution.rooms.flatMap(x => x.bedPositions).length;
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
            type: 'datetime',
            min: addDays(now, -1).getTime(),
            max: addDays(now, 7).getTime(),
            position: 'top'
        },
        tooltip: {
            x: {
                format: 'dd MMM HH:mm'
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val, options) => {
                const dataPointIndex = options.dataPointIndex;
                const bedOccupancy = props.bedOccupancies[dataPointIndex-bedCount];
                if(!bedOccupancy || bedOccupancy.state === BedState.Empty) {
                    return '';
                } else if(bedOccupancy.state === BedState.Reserved || bedOccupancy.state === BedState.Occupied) {
                    return bedOccupancy.patient ? formatPerson(bedOccupancy.patient) : resolveText('UnknownPatient')
                } else if(bedOccupancy.state === BedState.Unavailable) {
                    return bedOccupancy.unavailabilityReason ?? '';
                } else {
                    return '';
                }
            },
            style: {
                colors: [ '#000' ]
            }
        },
        states: {
            hover: {
                filter: {
                    type: 'darken',
                    value: 0.7
                }
            }
        },
        annotations: {
            xaxis: [
                {
                    x: nowTicks,
                    borderColor: '#f00',
                    borderWidth: 2,
                    label: {
                        text: resolveText('Now')
                    }
                }
            ]
        }
    };
    const getColorForOccupancyState = (occupancyState: BedState) => {
        switch(occupancyState) {
            case BedState.Reserved:
                return '#fff3cd';
            case BedState.Occupied:
                return '#d4edda';
            case BedState.Unavailable:
                return '#f8d7da';
            case BedState.Empty:
            default:
                return '#d6d8d9';
        }
    }
    const bedTimelineSeries: any[] = [
    {
        data: props.institution.rooms.flatMap(room => 
            room.bedPositions.map(bedPosition => {
                return {
                    x: formatBed(room, bedPosition),
                    y: [ nowTicks, nowTicks+1],
                    fillColor: ''
                }
            })).concat(
                props.bedOccupancies.map(bedOccupancy => {
                    const startTime = new Date(bedOccupancy.startTime); 
                    const endTime = bedOccupancy.endTime 
                        ? new Date(bedOccupancy.endTime) 
                        : addYears(startTime, 1);
                    return {
                        x: formatBed(bedOccupancy.room, bedOccupancy.bedPosition),
                        y: [ 
                            startTime.getTime(),  
                            endTime.getTime()
                        ],
                        fillColor: getColorForOccupancyState(bedOccupancy.state)
                    }
                })
        )
    }];

    return (
        <Chart
            type="rangeBar"
            options={chartOptions}
            series={bedTimelineSeries}
        />
    );

}