import React, { useEffect, useState } from 'react';
import { Alert, FormControl, InputGroup } from 'react-bootstrap';
import { getAutoCompleteContextForDiagnosticTestOptions, getAutoCompleteContextForDiagnosticTestUnit } from '../../helpers/AutoCompleteContexts';
import { v4 as uuid } from 'uuid';
import { NotificationManager } from 'react-notifications';
import { DiagnosticTestScaleType, HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { FileUpload } from '../../../sharedCommonComponents/components/FileUpload';
import { MemoryFormControl } from '../../../sharedCommonComponents/components/MemoryFormControl';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface DiagnosticTestValueEditorProps {
    testResult: Models.DiagnosticTestResults.DiagnosticTestResult;
    onChange: (update: Update<Models.DiagnosticTestResults.DiagnosticTestResult>) => void;
}

export const DiagnosticTestValueEditor = (props: DiagnosticTestValueEditorProps) => {

    const scaleType = props.testResult.scaleType;
    switch(scaleType) {
        case DiagnosticTestScaleType.Nominal:
            return (<NominalValueEditor {...props} />);
        case DiagnosticTestScaleType.Ordinal:
            return (<OrdinalValueEditor {...props} />);
        case DiagnosticTestScaleType.OrdinalOrQuantitative:
            return (<OrdinalOrQuantativeValueEditor {...props} />);
        case DiagnosticTestScaleType.Quantitative:
            return (<QuantativeValueEditor {...props} />);
        case DiagnosticTestScaleType.Freetext:
            return (<FreetextValueEditor {...props} />);
        case DiagnosticTestScaleType.Document:
            return (<DocumentValueEditor {...props} />);
        default:
            throw new Error(`No value editor implemented for scale type '${scaleType}'`);
    }
}

const NominalValueEditor = (props: DiagnosticTestValueEditorProps) => {
    const nominalTestResult = props.testResult as Models.DiagnosticTestResults.NominalDiagnosticTestResult;
    const [ value, setValue ] = useState<string>(nominalTestResult.value);
    
    const onChange = props.onChange;
    useEffect(() => {
        const update: Update<Models.DiagnosticTestResults.DiagnosticTestResult> = (testResult) => {
            const updatedItem: Models.DiagnosticTestResults.NominalDiagnosticTestResult = {
                ...testResult,
                value: value
            }
            return updatedItem;
        }
        onChange(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ value ]);
    return (
        <MemoryFormControl
            context={getAutoCompleteContextForDiagnosticTestOptions(props.testResult.testCodeLoinc ?? props.testResult.testCodeLocal)}
            defaultValue={nominalTestResult.value}
            onChange={setValue}
        />
    )
}
const OrdinalValueEditor = NominalValueEditor;
const QuantativeValueEditor = (props: DiagnosticTestValueEditorProps) => {
    const quantativeTestResult = props.testResult as Models.DiagnosticTestResults.QuantitativeDiagnosticTestResult;
    const [ value, setValue ] = useState<number>(quantativeTestResult.value);
    const [ unit, setUnit ] = useState<string>(quantativeTestResult.unit);
    const onChange = props.onChange;
    useEffect(() => {
        const update: Update<Models.DiagnosticTestResults.DiagnosticTestResult> = (testResult) => {
            const updatedItem: Models.DiagnosticTestResults.QuantitativeDiagnosticTestResult = {
                ...testResult,
                value: value,
                unit: unit,
                referenceRangeStart: quantativeTestResult.referenceRangeStart,
                referenceRangeEnd: quantativeTestResult.referenceRangeEnd
            }
            return updatedItem;
        }
        onChange(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ value, unit ]);
    return (
        <InputGroup>
            <FormControl
                type="number"
                step="0.1"
                defaultValue={quantativeTestResult.value}
                onBlur={(e:any) => setValue(e.target.value)}
                className="mx-1"
            />
            <MemoryFormControl
                context={getAutoCompleteContextForDiagnosticTestUnit(props.testResult.testCodeLoinc ?? props.testResult.testCodeLocal)}
                defaultValue={quantativeTestResult.unit}
                onChange={setUnit}
                placeholder={resolveText('Unit')}
                className="mx-1"
                minSearchTextLength={1}
            />
        </InputGroup>
    )
}
const OrdinalOrQuantativeValueEditor = (props: DiagnosticTestValueEditorProps) => {
    const [ scaleType, setScaleType ] = useState<DiagnosticTestScaleType>();
    const onChange = props.onChange;
    useEffect(() => {
        if(!scaleType) return;
        // Updating the scale type of the test result will commit that result to that scale type
        // and this OrdinalOrQuantativeValueEditor will be replaced by the editor for that scale type. 
        const update: Update<Models.DiagnosticTestResults.DiagnosticTestResult> = (testResult) => {
            const updatedItem: Models.DiagnosticTestResults.DiagnosticTestResult = {
                ...testResult,
                scaleType: scaleType
            };
            return updatedItem;
        }
        onChange(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ scaleType ]);

    return (
        <InputGroup>
            <FormControl
                as="select"
                value={scaleType ?? ''}
                onChange={(e:any) => setScaleType(e.target.value)}
            >
                <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                <option value={DiagnosticTestScaleType.Ordinal}>{resolveText(`DiagnosticTestScaleType_${DiagnosticTestScaleType.Ordinal}`)}</option>
                <option value={DiagnosticTestScaleType.Quantitative}>{resolveText(`DiagnosticTestScaleType_${DiagnosticTestScaleType.Quantitative}`)}</option>
            </FormControl>
            {scaleType === DiagnosticTestScaleType.Ordinal ? <OrdinalValueEditor {...props} />
            : scaleType === DiagnosticTestScaleType.Quantitative ? <QuantativeValueEditor {...props} />
            : null}
        </InputGroup>
    )
}
const FreetextValueEditor = (props: DiagnosticTestValueEditorProps) => {
    const freetextTestResult = props.testResult as Models.DiagnosticTestResults.FreetextDiagnosticTestResult;
    const [ value, setValue ] = useState<string>(freetextTestResult.text);
    const onChange = props.onChange;
    useEffect(() => {
        const update: Update<Models.DiagnosticTestResults.DiagnosticTestResult> = (testResult) => {
            const updatedItem: Models.DiagnosticTestResults.FreetextDiagnosticTestResult = {
                ...testResult,
                text: value
            };
            return updatedItem;
        }
        onChange(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ value ]);
    return (
        <FormControl
            as="textarea"
            value={value}
            onChange={(e:any) => setValue(e.target.value)}
        />
    )
}
const DocumentValueEditor = (props: DiagnosticTestValueEditorProps) => {
    const documentTestResult = props.testResult as Models.DiagnosticTestResults.DocumentDiagnosticTestResult;
    const [ documentId, setDocumentId] = useState<string>(documentTestResult.documentId);
    const [ file, setFile ] = useState<File>();
    const [ isUploading, setIsUploading ] = useState<boolean>(false);
    const [ isFileUploaded, setIsFileUploaded ] = useState<boolean>(false);
    const onChange = props.onChange;
    useEffect(() => {
        if(!documentId) return;
        const update: Update<Models.DiagnosticTestResults.DiagnosticTestResult> = (testResult) => {
            const updatedItem: Models.DiagnosticTestResults.DocumentDiagnosticTestResult = {
                ...testResult,
                documentId: documentId
            }
            return updatedItem;
        }
        onChange(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ documentId ]);
    const uploadFile = async (file: File) => {
        setIsUploading(true);
        try {
            const document: Models.PatientDocument = {
                id: uuid(),
                type: HealthRecordEntryType.Document,
                fileName: file.name,
                createdBy: '',
                timestamp: new Date(),
                note: '',
                personId: props.testResult.personId
            }
            await apiClient.instance!.put(`api/documents/${document.id}`, {}, document);
            await apiClient.instance!.put(`api/documents/${document.id}/upload`, {}, file, { stringifyBody: false });
            NotificationManager.success(resolveText('Patient_Document_SuccessfullyStored'));
            setDocumentId(document.id);
            setIsFileUploaded(true);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('Patient_Document_CouldNotStore'));
        } finally {
            setIsUploading(false);
        }
    }
    useEffect(() => {
        setIsFileUploaded(false);
    }, [ file ]);

    return (
    <>
        {file ?
            <Alert variant="info" dismissible onClose={() => setFile(undefined)}>
                {file.name} 
                {!isFileUploaded ? <AsyncButton 
                    size="sm"
                    activeText={resolveText('Upload')}
                    executingText={resolveText('Uploading...')}
                    isExecuting={isUploading}
                    disabled={!file}
                    onClick={() => uploadFile(file)} 
                /> 
                : <i className="fa fa-check green" />}
            </Alert>
        : null}
        <FileUpload
            onDrop={files => setFile(files[0])}
        />
    </>
    );
}