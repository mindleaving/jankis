import { Models } from "../../../localComponents/types/models";
import { TestResultTable } from "./TestResultTable";

interface PatientTestResultsViewProps {
    testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
}

export const PatientTestResultsView = (props: PatientTestResultsViewProps) => {

    return (
        <div className='m-3'>
            <TestResultTable
                items={props.testResults}
            />
        </div>
    );
}