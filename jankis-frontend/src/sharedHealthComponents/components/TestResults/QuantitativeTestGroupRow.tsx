import { useContext } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { differenceInSeconds } from 'date-fns';
import { Models } from '../../../localComponents/types/models';
import { mathjs } from '../../../sharedCommonComponents/helpers/mathjs';
import { formatDate, formatDiagnosticTestNameOfResult } from '../../helpers/Formatters';
import UserContext from '../../../localComponents/contexts/UserContext';
import { needsHiding } from '../../../localComponents/helpers/HealthRecordEntryHelpers';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { Table } from 'react-bootstrap';
import { TestResultTableRow } from './TestResultTableRow';

interface QuantitativeTestGroupRowProps {
    commonUnit: string;
    testResults: Models.DiagnosticTestResults.QuantitativeDiagnosticTestResult[];
}

export const QuantitativeTestGroupRow = (props: QuantitativeTestGroupRowProps) => {

    const user = useContext(UserContext);
    const commonUnit = props.commonUnit;
    const timeOrderedTests = [...props.testResults].sort((a,b) => differenceInSeconds(new Date(a.timestamp), new Date(b.timestamp)));
    const firstTest = timeOrderedTests[0];
    const lastTest = timeOrderedTests[timeOrderedTests.length-1];
    const startTime = new Date(firstTest.timestamp).getTime();
    const endTime = new Date(lastTest.timestamp).getTime();
    const testName = firstTest.testName;
    
    const chartOptions: ApexOptions = {
        chart: {
            sparkline: {
                enabled: true
            },
            toolbar: {
                show: false
            },
            events: {
                beforeResetZoom: () => {
                    return {
                        xaxis: {
                            min: startTime,
                            max: endTime
                        }
                    };
                }
            }
        },
        tooltip: {
            x: {
                format: 'yyyy-MM-dd HH:mm'
            }
        },
        markers: {
            size: 4,
            shape: 'circle'
        },
        stroke: {
            width: 3
        },
        grid: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        xaxis: {
            type: "datetime",
            min: startTime,
            max: endTime,
            tooltip: {
                enabled: false
            },
            labels: {
                datetimeUTC: false
            }
        },
        yaxis: {
            show: false,
            labels: {
                formatter: str => `${str} ${commonUnit}`
            }
        }
    };
    
    const unhiddenTests = timeOrderedTests.filter(testResult => !needsHiding(testResult, user!));
    const series: ApexAxisChartSeries = [
        {
            name: testName,
            data: unhiddenTests.map(x => {
                const value = mathjs
                    .unit(x.value, x.unit!)
                    .to(commonUnit)
                    .toNumber();
                return {
                    x: new Date(x.timestamp).getTime(),
                    y: value
                };
            })
        }
    ];
    return (<tr>
        <td>
            <strong>{formatDiagnosticTestNameOfResult(lastTest)}</strong>
            <div><small>{formatDate(new Date(lastTest.timestamp))}</small></div>
        </td>
        <td colSpan={2}>
            <AccordionCard standalone
                eventKey={testName}
                className='p-0'
                title={
                    <Chart
                        options={chartOptions}
                        series={series}
                        height="60px"
                    />
                }
            >
                <Table>
                    <tbody>
                        {props.testResults.map(testResult => (
                            <TestResultTableRow
                                key={testResult.id}
                                testResult={testResult}
                            />
                        ))}
                    </tbody>
                </Table>
            </AccordionCard>
        </td>
    </tr>);

}