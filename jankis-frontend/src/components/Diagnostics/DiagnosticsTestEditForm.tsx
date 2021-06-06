import React, { FormEvent, useState } from 'react';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { apiClient } from '../../communication/ApiClient';
import { resolveText } from '../../helpers/Globalizer';
import { DiagnosticTestScaleType, ServiceAudienceType } from '../../types/enums';
import { Models } from '../../types/models';
import { AsyncButton } from '../AsyncButton';
import { RowFormGroup } from '../RowFormGroup';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid} from 'uuid';

interface DiagnosticsTestEditFormProps {
    id?: string;
}

export const DiagnosticsTestEditForm = (props: DiagnosticsTestEditFormProps) => {

    const [ testName, setTestName ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const [ testCodeLoinc, setTestCodeLoinc ] = useState<string>('');
    const [ testCodeLocal, setTestCodeLocal ] = useState<string>('');
    const [ scaleType, setscaleType ] = useState<DiagnosticTestScaleType>(DiagnosticTestScaleType.Quantitative);
    const [ category, setCategory ] = useState<string>('');
    const [ isStoring, setIsStoring ] = useState<boolean>(false);

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        try {
            setIsStoring(true);
            const diagnosticTest = buildDiagnosticTest();
            await apiClient.put(`api/diagnostictests/TODO`, {}, diagnosticTest);
            NotificationManager.success(resolveText('Diagnostics_SuccessfullyStored'));
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Diagnostics_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }
    const buildDiagnosticTest = (): Models.DiagnosticTestDefinition => {
        return {
            id: props.id ?? uuid(),
            name: testName,
            description: description,
            testCodeLoinc: testCodeLoinc,
            testCodeLocal: testCodeLocal,
            scaleType: scaleType,
            category: category,
            audience: [
                {
                    type: ServiceAudienceType.Role,
                    roleId: ''
                } as Models.ServiceAudience
            ],
            parameters: [],
            departmentId: '',
            isAvailable: true,
            autoAcceptRequests: false
        }
    }
    return (
        <Form onSubmit={store}>
            <RowFormGroup
                label={resolveText('Diagnostics_Name')}
                value={testName}
                onChange={setTestName}
            />
            <RowFormGroup
                label={resolveText('Diagnostics_TestCodeLoinc')}
                value={testCodeLoinc}
                onChange={setTestCodeLoinc}
            />
            <RowFormGroup
                label={resolveText('Diagnostics_TestCodeLocal')}
                value={testCodeLocal}
                onChange={setTestCodeLocal}
            />
            <RowFormGroup
                label={resolveText('Diagnostics_Category')}
                value={category}
                onChange={setCategory}
            />
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Diagnostics_ScaleType')}</FormLabel>
                <Col>
                    <FormControl
                        as="select"
                        value={scaleType}
                        onChange={(e:any) => setscaleType(e.target.value)}
                    >
                        {Object.keys(DiagnosticTestScaleType).map(x => (
                            <option key={x} value={x}>{resolveText(`DiagnosticTestScaleType_${x}`)}</option>
                        ))}
                    </FormControl>
                </Col>
            </FormGroup>
            <RowFormGroup
                label={resolveText('Diagnostics_Description')}
                as="textarea"
                value={description}
                onChange={setDescription}
            />
            <AsyncButton
                activeText={resolveText('Store')}
                executingText={resolveText('Storing...')}
                isExecuting={isStoring}
            />
        </Form>
    );

}