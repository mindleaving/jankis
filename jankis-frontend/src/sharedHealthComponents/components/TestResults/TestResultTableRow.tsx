import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../localComponents/contexts/UserContext';
import { needsHiding } from '../../../localComponents/helpers/HealthRecordEntryHelpers';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { Models } from '../../../localComponents/types/models';
import { formatDate } from '../../helpers/Formatters';
import { dispatchDeleteTestResult } from '../../helpers/TestResultHelpers';
import { markTestResultAsSeen } from '../../redux/slices/testResultsSlice';
import { HidableHealthRecordEntryValue } from '../HidableHealthRecordEntryValue';
import { DiagnosticTestValueView } from './DiagnosticTestValueView';

interface TestResultTableRowProps {
    testResult: Models.DiagnosticTestResults.DiagnosticTestResult;
}

export const TestResultTableRow = (props: TestResultTableRowProps) => {

    const user = useContext(UserContext);
    const testResult = props.testResult;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const unhide = () => dispatch(markTestResultAsSeen({ args: testResult.id }));

    const dispatchDeleteTestResultLocal = () => {
        dispatchDeleteTestResult(testResult, dispatch);
    }
    return (
        <tr>
            <td>
                <i
                    className="fa fa-trash red clickable"
                    onClick={dispatchDeleteTestResultLocal}
                />
            </td>
            <td>
                {formatDate(new Date(testResult.timestamp))}
            </td>
            <td>
                <HidableHealthRecordEntryValue
                    hideValue={needsHiding(testResult, user!)}
                    onMarkAsSeen={unhide}
                >
                    <DiagnosticTestValueView
                        testResult={testResult}
                    />
                </HidableHealthRecordEntryValue>
            </td>
            <td>
                <i
                    className="fa fa-edit clickable"
                    onClick={() => navigate(`/healthrecord/${testResult.personId}/edit/testresult/${testResult.id}`)}
                />
            </td>
        </tr>
    );

}