import { Table } from "react-bootstrap";
import { Models } from "../../../localComponents/types/models";
import { groupBy, mostCommonValue } from "../../../sharedCommonComponents/helpers/CollectionHelpers";
import { canConvertTo } from "../../../sharedCommonComponents/helpers/mathjs";
import { DiagnosticTestScaleType } from "../../../localComponents/types/enums.d";
import { NonQuantitativeTestResultRow } from "./NonQuantitativeTestResultRow";
import { QuantitativeTestResultRow } from "./QuantitativeTestResultRow";
import { differenceInSeconds } from "date-fns";

interface TestResultTableProps {
    items: Models.DiagnosticTestResults.DiagnosticTestResult[];
}

export const TestResultTable = (props: TestResultTableProps) => {

    const inverseTimeOrderedTests = props.items.sort((a,b) => -differenceInSeconds(new Date(a.timestamp), new Date(b.timestamp)));
    const groupedTestResults = groupBy(inverseTimeOrderedTests, x => x.testCodeLoinc);
    return (
        <Table>
            <tbody>
                {groupedTestResults.map(testGroup => {
                    if(testGroup.items.length === 1) {
                        return (<NonQuantitativeTestResultRow
                            testResults={testGroup.items}
                        />);
                    }
                    const isQuantitativeTest = testGroup.items.every(x => x.scaleType === DiagnosticTestScaleType.Quantitative);
                    if(!isQuantitativeTest) {
                        return (<NonQuantitativeTestResultRow
                            testResults={testGroup.items}
                        />);
                    }
                    const quantitativeTestResults = testGroup.items.map(x => x as Models.DiagnosticTestResults.QuantitativeDiagnosticTestResult);
                    const units = quantitativeTestResults.map(x => x.unit);
                    const commonUnit = mostCommonValue(units)!;
                    const hasSharedUnit = quantitativeTestResults.every(x => canConvertTo(x.value, x.unit, commonUnit));
                    if(!hasSharedUnit) {
                        <NonQuantitativeTestResultRow
                            testResults={quantitativeTestResults}
                        />
                    }
                    return (<QuantitativeTestResultRow
                        commonUnit={commonUnit}
                        testResults={quantitativeTestResults}
                    />);
                })}
            </tbody>
        </Table>
    );

}

