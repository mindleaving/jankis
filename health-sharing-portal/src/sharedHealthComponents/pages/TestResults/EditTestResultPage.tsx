import { FormEvent, useEffect, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { Models } from '../../../localComponents/types/models';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { PatientAutocomplete } from '../../components/Autocompletes/PatientAutocomplete';
import { DiagnosticTestValueEditor } from '../../components/TestResults/DiagnosticTestValueEditor';
import { loadPerson } from '../../redux/slices/personsSlice';
import { addTestResult, loadTestResult } from '../../redux/slices/testResultsSlice';

interface EditTestResultPageProps {}

export const EditTestResultPage = (props: EditTestResultPageProps) => {

    const { personId, id } = useParams();
    const matchedProfileData = useAppSelector(state => state.persons.items.find(x => x.id));
    const [ profileData, setProfileData ] = useState<Models.Person | undefined>(matchedProfileData);

    const isLoading = useAppSelector(state => state.testResults.isLoading);
    const matchedTestResult = useAppSelector(state => state.testResults.items.find(x => x.id === id));
    const [ testResult, setTestResult ] = useState<Models.DiagnosticTestResults.DiagnosticTestResult | undefined>(matchedTestResult);
    const isStoring = useAppSelector(state => state.testResults.isSubmitting);
    
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(!personId) return;
        dispatch(loadPerson({ personId }));
    }, [ personId ]);

    useEffect(() => {
        if(!profileData) {
            setProfileData(matchedProfileData);
        }
    }, [ matchedProfileData]);

    useEffect(() => {
        if(!id) {
            return;
        }
        dispatch(loadTestResult({ args: id }));
    }, [ id ]);

    useEffect(() => {
        setTestResult(matchedTestResult);
    }, [ matchedTestResult ]);

    const setTimestamp = (newTimestamp: Date) => {
        setTestResult(state => state ? 
            {
                ...state,
                timestamp: newTimestamp
            } : undefined
        );
    }

    const store = (e?: FormEvent) => {
        e?.preventDefault();
        dispatch(addTestResult({
            args: testResult!,
            body: testResult!,
            onSuccess: () => navigate(-1)
        }));
    }

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }

    if(!testResult) {
        return (<h3>{resolveText("NotFound")}</h3>);
    }

    return (
        <>
            <h1>{resolveText('TestResult')}</h1>
            <Form onSubmit={store}>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Patient')}</FormLabel>
                    <Col>
                        <PatientAutocomplete
                            value={profileData}
                            onChange={setProfileData}
                        />
                    </Col>
                </FormGroup>
                <RowFormGroup
                    type="datetime"
                    label={resolveText("TestResult_Timestamp")}
                    value={testResult?.timestamp}
                    onChange={setTimestamp}
                />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText("TestResult_Value")}</FormLabel>
                    <Col>
                        <DiagnosticTestValueEditor
                            testResult={testResult}
                            onChange={update => setTestResult(state => update(state!))}
                        />
                    </Col>
                </FormGroup>
                <StoreButton
                    type="submit"
                    isStoring={isStoring}
                />
            </Form>
        </>
    );

}