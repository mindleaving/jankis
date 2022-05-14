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
import { TestResultTableRow } from "./TestResultTableRow";
import { useNavigate } from "react-router-dom";
import { dispatchDeleteTestResult } from "../../helpers/TestResultHelpers";

interface NonQuantitativeTestGroupRowProps {
    testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
}
export const NonQuantitativeTestGroupRow = (props: NonQuantitativeTestGroupRowProps) => {

    const user = useContext(UserContext);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    if(!props.testResults || props.testResults.length === 0) {
        return null;
    }
    
    if(props.testResults.length === 1) {
        const testResult = props.testResults[0];
        const hideValue = needsHiding(testResult, user!);
        const unhide = () => dispatch(markTestResultAsSeen({ args: testResult.id }));
        return (<tr>
            <td>
                <strong>{formatDiagnosticTestNameOfResult(testResult)}</strong>
                <div><small>{formatDate(new Date(testResult.timestamp))}</small></div>
            </td>
            <td>
                <HidableHealthRecordEntryValue
                    hideValue={hideValue}
                    onMarkAsSeen={unhide}
                >
                    <DiagnosticTestValueView
                        testResult={testResult}
                    />
                </HidableHealthRecordEntryValue>
            </td>
            <td>
                <i
                    className="fa fa-edit clickable mx-2"
                    onClick={() => navigate(`/healthrecord/${testResult.personId}/edit/testresult/${testResult.id}`)}
                />
                <i
                    className="fa fa-trash red clickable"
                    onClick={() => dispatchDeleteTestResult(testResult, dispatch)}
                />
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
        <td colSpan={2}>
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