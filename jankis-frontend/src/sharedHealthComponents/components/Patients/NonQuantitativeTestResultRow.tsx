import { differenceInSeconds } from "date-fns";
import { Table } from "react-bootstrap";
import { Models } from "../../../localComponents/types/models";
import { AccordionCard } from "../../../sharedCommonComponents/components/AccordionCard";
import { formatDate, formatDiagnosticTestNameOfResult } from "../../helpers/Formatters";
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
                <div><small>{formatDate(new Date(testResult.timestamp))}</small></div>
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
            <div><small>{formatDate(new Date(lastTest.timestamp))}</small></div>
        </td>
        <td>
            <AccordionCard standalone
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
                                    {formatDate(new Date(testResult.timestamp))}
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