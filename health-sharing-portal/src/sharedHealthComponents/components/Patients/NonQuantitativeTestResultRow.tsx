import { differenceInSeconds, format } from "date-fns";
import { Table } from "react-bootstrap";
import { Models } from "../../../localComponents/types/models";
import { AccordionCard } from "../../../sharedCommonComponents/components/AccordionCard";
import { formatDiagnosticTestNameOfResult } from "../../helpers/Formatters";
import { DiagnosticTestValueView } from "./DiagnosticTestValueView";

interface NonQuantitativeTestResultRowProps {
    testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
}
export const NonQuantitativeTestResultRow = (props: NonQuantitativeTestResultRowProps) => {
    if(!props.testResults || props.testResults.length === 0) {
        return null;
    }
    if(props.testResults.length === 1) {
        const testResult = props.testResults[0];
        return (<tr>
            <td>
                <strong>{formatDiagnosticTestNameOfResult(testResult)}</strong>
                <div><small>{format(new Date(testResult.timestamp), 'yyyy-MM-dd HH:mm')}</small></div>
            </td>
            <td>
                <DiagnosticTestValueView
                    testResult={testResult}
                />
            </td>
        </tr>);
    }
    const inverseTimeOrderedTests = props.testResults.sort((a,b) => -differenceInSeconds(new Date(a.timestamp), new Date(b.timestamp)));
    const lastTest = inverseTimeOrderedTests[0];
    return (<tr>
        <td>
            <strong>{formatDiagnosticTestNameOfResult(lastTest)}</strong>
            <div><small>{format(new Date(lastTest.timestamp), 'yyyy-MM-dd HH:mm')}</small></div>
        </td>
        <td>
            <AccordionCard
                eventKey={lastTest.testCodeLoinc}
                title={<DiagnosticTestValueView
                    testResult={lastTest}
                />}
            >
                <Table>
                    <tbody>
                        {inverseTimeOrderedTests.map(testResult => (
                            <tr>
                                <td>
                                    {format(new Date(testResult.timestamp), 'yyyy-MM-dd HH:mm')}
                                </td>
                                <td>
                                    <DiagnosticTestValueView
                                        testResult={testResult}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </AccordionCard>
        </td>
    </tr>);
    
}