import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { TestResultTable } from "./TestResultTable";

interface PatientTestResultsViewProps {
    testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
}

export const PatientTestResultsView = (props: PatientTestResultsViewProps) => {

    return (
        <div className='m-3'>
            <div className="timelineSeparator">
                <span className="text-secondary">{resolveText('Now')}</span>
            </div>
            <TestResultTable
                items={props.testResults}
            />
        </div>
    );
}