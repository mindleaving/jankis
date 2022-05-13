import { FormEvent, useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import UserContext from '../../../localComponents/contexts/UserContext';
import { Models } from '../../../localComponents/types/models';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { v4 as uuid } from 'uuid';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { DiagnosticTestAutocomplete } from '../Autocompletes/DiagnosticTestAutocomplete';
import { NotificationManager } from 'react-notifications';
import { useNavigate } from 'react-router-dom';
import { HealthRecordEntryFormProps } from '../../types/frontendTypes';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { addTestResult } from '../../redux/slices/testResultsSlice';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { TestResultsFormRow } from './TestResultsFormRow';
import { differenceInMinutes } from 'date-fns';

interface TestResultsFormProps extends HealthRecordEntryFormProps {}

export const TestResultsForm = (props: TestResultsFormProps) => {

    const user = useContext(UserContext);
    const [ defaultTimestamp, setDefaultTimestamp ] = useState<Date>(new Date());
    const [ testResults, setTestResults ] = useState<Models.DiagnosticTestResults.DiagnosticTestResult[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setTestResults(state => state.map(x => ({
            ...x,
            timestamp: defaultTimestamp
        })));
    }, [ defaultTimestamp ]);
    
    const changeDefaultTimestamp = (newDate: Date) => {
        setDefaultTimestamp(state => Math.abs(differenceInMinutes(newDate, defaultTimestamp)) >= 1 ? newDate : state);
    }

    const addNewTest = (testDefinition?: Models.Services.DiagnosticTestDefinition) => {
        if(!testDefinition) {
            return;
        }
        const testResult: Models.DiagnosticTestResults.DiagnosticTestResult = {
            id: uuid(),
            type: HealthRecordEntryType.TestResult,
            createdBy: user!.accountId,
            personId: props.personId,
            scaleType: testDefinition.scaleType,
            testCodeLocal: testDefinition.testCodeLocal,
            testCodeLoinc: testDefinition.testCodeLoinc,
            testName: testDefinition.name,
            testCategory: testDefinition.category,
            timestamp: defaultTimestamp,
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === props.personId,
        };
        setTestResults(state => state.concat(testResult));
    }

    const removeTest = (testResultId: string) => {
        setTestResults(state => state.filter(x => x.id !== testResultId));
    }

    const updateTestResult = (testResultId: string, update: Update<Models.DiagnosticTestResults.DiagnosticTestResult>) => {
        setTestResults(state => state.map(x => x.id === testResultId ? update(x) : x));
    }

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        setIsSubmitting(true);
        try {
            for (const testResult of testResults) {
                dispatch(addTestResult({
                    args: testResult,
                    body: testResult,
                    onSuccess: () => navigate(-1)
                }));
            }
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("TestResults_CouldNotStore"));
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <>
            <RowFormGroup
                label={resolveText("TestResult_Timestamp")}
                value={defaultTimestamp}
                onChange={changeDefaultTimestamp}
                type='datetime'
            />
            <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>{resolveText("TestResult_Name")}</th>
                        <th>{resolveText("TestResult_Timestamp")}</th>
                        <th>{resolveText("TestResult_Value")}</th>
                    </tr>
                </thead>
                <tbody>
                    {testResults.map(testResult => {
                        return (<TestResultsFormRow
                            key={testResult.id} 
                            testResult={testResult}
                            removeTest={removeTest}
                            updateTestResult={updateTestResult}
                        />);
                    })}
                    <tr>
                        <td></td>
                        <td>
                            <DiagnosticTestAutocomplete
                                onChange={addNewTest}
                            />
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
            <AsyncButton
                onClick={store}
                activeText={resolveText("Submit")}
                executingText={resolveText("Submitting...")}
                isExecuting={isSubmitting}
            />
        </>
    );

}