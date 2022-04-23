import { FormEvent, useContext, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import UserContext from '../../../localComponents/contexts/UserContext';
import { Models } from '../../../localComponents/types/models';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { v4 as uuid } from 'uuid';
import { HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { DiagnosticTestAutocomplete } from '../Autocompletes/DiagnosticTestAutocomplete';
import { DiagnosticTestValueEditor } from './DiagnosticTestValueEditor';
import { formatDiagnosticTestNameOfResult } from '../../helpers/Formatters';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { useNavigate } from 'react-router-dom';
import { HealthRecordEntryFormProps } from '../../types/frontendTypes';

interface TestResultsFormProps extends HealthRecordEntryFormProps {}

export const TestResultsForm = (props: TestResultsFormProps) => {

    const user = useContext(UserContext);
    const [ testResults, setTestResults ] = useState<Models.DiagnosticTestResults.DiagnosticTestResult[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const navigate = useNavigate();


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
            timestamp: new Date(),
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
                await apiClient.instance!.put(`api/testresults/${testResult.id}`, {}, testResult);
            }
            navigate(-1);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("TestResults_CouldNotStore"));
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <Form onSubmit={store}>
            <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>{resolveText("TestResult_Name")}</th>
                        <th>{resolveText("TestResult_Value")}</th>
                    </tr>
                </thead>
                <tbody>
                    {testResults.map(testResult => {
                        return (
                        <tr key={testResult.id}>
                            <td>
                                <Button 
                                    size='sm'
                                    variant='danger'
                                    onClick={() => removeTest(testResult.id)}
                                >
                                    {resolveText("Remove")}
                                </Button>
                            </td>
                            <td>
                                <b>{formatDiagnosticTestNameOfResult(testResult)}</b>
                            </td>
                            <td>
                                <DiagnosticTestValueEditor
                                    testResult={testResult}
                                    onChange={(update) => updateTestResult(testResult.id, update)}
                                />
                            </td>
                        </tr>);
                    })}
                    <tr>
                        <td></td>
                        <td>
                            <DiagnosticTestAutocomplete
                                onChange={addNewTest}
                            />
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
            <AsyncButton
                type='submit'
                activeText={resolveText("Submit")}
                executingText={resolveText("Submitting...")}
                isExecuting={isSubmitting}
            />
        </Form>
    );

}