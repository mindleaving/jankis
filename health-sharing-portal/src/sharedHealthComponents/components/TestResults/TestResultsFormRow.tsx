import React from 'react';
import { Button } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { DateFormControl } from '../../../sharedCommonComponents/components/DateFormControl';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDiagnosticTestNameOfResult } from '../../helpers/Formatters';
import { DiagnosticTestValueEditor } from './DiagnosticTestValueEditor';

interface TestResultsFormRowProps {
    testResult: Models.DiagnosticTestResults.DiagnosticTestResult;
    removeTest: (testResultId: string) => void;
    updateTestResult: (testResultId: string, update: Update<Models.DiagnosticTestResults.DiagnosticTestResult>) => void;
}

export const TestResultsFormRow = (props: TestResultsFormRowProps) => {

    const setTimestamp = (date: Date | undefined) => {
        if(!date) {
            return;
        }
        props.updateTestResult(props.testResult.id, testResult => ({
            ...testResult,
            timestamp: date
        }));
    }
    return (
        <tr>
                <td>
                    <Button 
                        size='sm'
                        variant='danger'
                        onClick={() => props.removeTest(props.testResult.id)}
                    >
                        {resolveText("Remove")}
                    </Button>
                </td>
                <td>
                    <b>{formatDiagnosticTestNameOfResult(props.testResult)}</b>
                </td>
                <td>
                    <DateFormControl
                        enableTime
                        value={props.testResult.timestamp}
                        onChange={setTimestamp}
                    />
                </td>
                <td>
                    <DiagnosticTestValueEditor
                        testResult={props.testResult}
                        onChange={(update) => props.updateTestResult(props.testResult.id, update)}
                    />
                </td>
            </tr>
    );

}