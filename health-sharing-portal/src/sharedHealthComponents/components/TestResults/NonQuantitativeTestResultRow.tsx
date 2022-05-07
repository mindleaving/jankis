import { differenceInSeconds } from "date-fns";
import { useContext } from "react";
import { Table } from "react-bootstrap";
import UserContext from "../../../localComponents/contexts/UserContext";
import { needsHiding } from "../../../localComponents/helpers/HealthRecordEntryHelpers";
import { Models } from "../../../localComponents/types/models";
import { AccordionCard } from "../../../sharedCommonComponents/components/AccordionCard";
import { formatDate, formatDiagnosticTestNameOfResult } from "../../helpers/Formatters";
import { DiagnosticTestValueView } from "./DiagnosticTestValueView";
import { HidableHealthRecordEntryValue } from "../HidableHealthRecordEntryValue";
import { useAppDispatch } from "../../../localComponents/redux/store/healthRecordStore";
import { markTestResultAsSeen } from "../../redux/slices/testResultsSlice";

interface NonQuantitativeTestResultRowProps {
    testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
}
export const NonQuantitativeTestResultRow = (props: NonQuantitativeTestResultRowProps) => {

    const user = useContext(UserContext);
    const dispatch = useAppDispatch();

    if(!props.testResults || props.testResults.length === 0) {
        return null;
    }
    const unhide = (testResultId: string) => dispatch(markTestResultAsSeen({ args: testResultId }));
    if(props.testResults.length === 1) {
        const testResult = props.testResults[0];
        const hideValue = needsHiding(testResult, user!);
        return (<tr>
            <td>
                <strong>{formatDiagnosticTestNameOfResult(testResult)}</strong>
                <div><small>{formatDate(new Date(testResult.timestamp))}</small></div>
            </td>
            <td>
                <HidableHealthRecordEntryValue
                    hideValue={hideValue}
                    onMarkAsSeen={() => unhide(testResult.id)}
                >
                    <DiagnosticTestValueView
                        testResult={testResult}
                    />
                </HidableHealthRecordEntryValue>
            </td>
        </tr>);
    }
    const inverseTimeOrderedTests = [...props.testResults].sort((a,b) => -differenceInSeconds(new Date(a.timestamp), new Date(b.timestamp)));
    const lastTest = inverseTimeOrderedTests[0];
    const hideLastTest = needsHiding(lastTest, user!);
    return (<tr>
        <td>
            <strong>{formatDiagnosticTestNameOfResult(lastTest)}</strong>
            <div><small>{formatDate(new Date(lastTest.timestamp))}</small></div>
        </td>
        <td>
            <AccordionCard standalone
                eventKey={lastTest.testCodeLoinc}
                title={hideLastTest
                    ? <i className="fa fa-eye-slash" />
                    : <DiagnosticTestValueView
                        testResult={lastTest}
                    />
                }
            >
                <Table>
                    <tbody>
                        {inverseTimeOrderedTests.map(testResult => (
                            <tr key={testResult.id}>
                                <td>
                                    {formatDate(new Date(testResult.timestamp))}
                                </td>
                                <td>
                                    <HidableHealthRecordEntryValue
                                        hideValue={needsHiding(testResult, user!)}
                                        onMarkAsSeen={() => unhide(testResult.id)}
                                    >
                                        <DiagnosticTestValueView
                                            testResult={testResult}
                                        />
                                    </HidableHealthRecordEntryValue>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </AccordionCard>
        </td>
    </tr>);
    
}