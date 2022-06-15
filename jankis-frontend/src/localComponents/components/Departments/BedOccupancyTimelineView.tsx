import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { formatBed } from '../../helpers/Formatters';
import { addDays, addYears } from 'date-fns/esm';
import { BedState } from '../../types/enums.d';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatPerson } from '../../../sharedHealthComponents/helpers/Formatters';
import { useAppSelector } from '../../redux/store/healthRecordStore';


interface BedOccupancyTimelineViewProps {
    institutionId: string;
}

export const BedOccupancyTimelineView = (props: BedOccupancyTimelineViewProps) => {

    const now = new Date();
    const nowTicks = now.getTime();
    const bedOccupancies = useAppSelector(state => state.bedOccupancies.items.filter(x => x.institutionId === props.institutionId));
    const rooms = useAppSelector(state => state.rooms.items.filter(x => x.institutionId === props.institutionId));
    const bedCount = rooms.flatMap(x => x.bedPositions).length;
    const minTime = addDays(now, -1).getTime();
    const maxTime = addDays(now, 7).getTime();
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
                    }
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
            max: maxTime,
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
                const bedOccupancy = bedOccupancies[dataPointIndex-bedCount];
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
        data: rooms.flatMap(room => 
            room.bedPositions.map(bedPosition => {
                return {
                    x: formatBed(room, bedPosition),
                    y: [ nowTicks, nowTicks+1],
                    fillColor: ''
                }
            })).concat(
                bedOccupancies.map(bedOccupancy => {
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