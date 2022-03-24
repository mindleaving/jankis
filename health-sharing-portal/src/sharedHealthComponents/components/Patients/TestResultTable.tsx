import { differenceInSeconds } from "date-fns";
import { Table } from "react-bootstrap";
import { Models } from "../../../localComponents/types/models";
import { groupBy } from "../../../sharedCommonComponents/helpers/CollectionHelpers";
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { formatDiagnosticTestValue } from "../../helpers/Formatters";
import { DiagnosticTestValueView } from "./DiagnosticTestValueView";

interface TestResultTableProps {
    items: Models.DiagnosticTestResults.DiagnosticTestResult[];
}

export const TestResultTable = (props: TestResultTableProps) => {

    const groupedTestResults = groupBy(props.items, x => x.testCodeLoinc);
    return (
        <Table>
            <tbody>
                {groupedTestResults.map(testGroup => {
                    const testLoincCode = testGroup.key;
                    if(testGroup.items.length > 1) {
                        const timeOrderedTests = testGroup.items.sort((a,b) => differenceInSeconds(new Date(b.timestamp),new Date(a.timestamp)));
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
                                }
                            },
                            yaxis: {
                                show: false
                            }
                        }
                        return (<tr>
                            <td>
                                <strong>{`${testName} (${testLoincCode})`}</strong>
                                <div><small>{lastTest.timestamp}</small></div>
                            </td>
                            <td>
                                <Chart
                                    options={chartOptions}
                                    height="80px"
                                />
                            </td>
                        </tr>);
                    }
                    const testResult = testGroup.items[0];
                    return (<tr>
                        <td>
                            {testResult.testName}
                            <div><small>{testResult.timestamp}</small></div>
                        </td>
                        <td>
                            <DiagnosticTestValueView
                                testResult={testResult}
                            />
                        </td>
                    </tr>);
                })}
            </tbody>
        </Table>
    );

}