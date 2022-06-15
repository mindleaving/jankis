import { useContext, useEffect, useState } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { getAutoCompleteContextForDiagnosticTestOptions, getAutoCompleteContextForDiagnosticTestUnit } from '../../helpers/AutoCompleteContexts';
import { v4 as uuid } from 'uuid';
import { NotificationManager } from 'react-notifications';
import { DiagnosticTestScaleType, HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { MemoryFormControl } from '../../../sharedCommonComponents/components/MemoryFormControl';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import UserContext from '../../../localComponents/contexts/UserContext';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { addDocument, loadDocument } from '../../redux/slices/documentsSlice';
import { DocumentAlertOrUpload } from '../Documents/DocumentAlertOrUpload';

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
    const [ unit, setUnit ] = useState<string | undefined>(quantativeTestResult.unit);
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

    const user = useContext(UserContext);
    const documentTestResult = props.testResult as Models.DiagnosticTestResults.DocumentDiagnosticTestResult;
    const matchedDocument = useAppSelector(state => state.documents.items.find(x => x.id === documentTestResult.documentId));
    const [ document, setDocument ] = useState<Models.PatientDocument | undefined>(matchedDocument);
    const [ file, setFile ] = useState<File>();
    const [ isUploading, setIsUploading ] = useState<boolean>(false);
    const [ isFileUploaded, setIsFileUploaded ] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(document && document.id === documentTestResult.documentId) {
            return;
        }
        if(!documentTestResult.documentId) {
            return;
        }
        dispatch(loadDocument({ args: documentTestResult.documentId }));
    }, [ documentTestResult.documentId ]);
    useEffect(() => {
        if(!document && matchedDocument) {
            setDocument({ ...matchedDocument });
        }
    }, [ matchedDocument ]);
    useEffect(() => {
        if(!document) return;
        const update: Update<Models.DiagnosticTestResults.DiagnosticTestResult> = (testResult) => {
            const updatedItem: Models.DiagnosticTestResults.DocumentDiagnosticTestResult = {
                ...testResult,
                documentId: document.id
            }
            return updatedItem;
        }
        props.onChange(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ document ]);
    const uploadFile = async () => {
        if(!file) {
            return;
        }
        setIsUploading(true);
        const documentCandidate: Models.PatientDocument = document ?
        {
            ...document
        } 
        : {
            id: uuid(),
            type: HealthRecordEntryType.Document,
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === props.testResult.personId,
            fileName: file.name,
            createdBy: documentTestResult.createdBy,
            timestamp: documentTestResult.timestamp,
            note: '',
            personId: props.testResult.personId
        };
        documentCandidate.fileName = file.name;

        dispatch(addDocument({
            args: documentCandidate,
            body: documentCandidate,
            onSuccess: async () => {
                setDocument(documentCandidate);
                try {
                    if(file) {
                        await apiClient.instance!.put(`api/documents/${documentCandidate.id}/upload`, {}, file, { stringifyBody: false });
                        NotificationManager.success(resolveText('Document_SuccessfullyUploaded'));
                    }
                    setIsFileUploaded(true);
                } catch(error:any) {
                    NotificationManager.error(error.message, resolveText('Document_CouldNotUpload'));
                }
            }
        }));
        setIsUploading(false);
    }
    useEffect(() => {
        setIsFileUploaded(false);
    }, [ file ]);

    return (
        <DocumentAlertOrUpload
            document={document}
            onFileSelected={setFile}
            onUploadClicked={uploadFile}
            isUploading={isUploading}
            isFileUploaded={isFileUploaded}
        />
    );
}