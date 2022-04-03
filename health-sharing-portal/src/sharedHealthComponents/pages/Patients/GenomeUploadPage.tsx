import React, { FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { NotificationManager } from 'react-notifications';
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../../../localComponents/contexts/UserContext';
import { Models } from '../../../localComponents/types/models';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { DiagnosticTestScaleType, HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { v4 as uuid } from 'uuid';
import { Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { FileUpload } from '../../../sharedCommonComponents/components/FileUpload';

interface GenomeUploadPageProps {}

export const GenomeUploadPage = (props: GenomeUploadPageProps) => {

    const { personId } = useParams();
    const user = useContext(UserContext);

    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ referenceGenome, setReferenceGenome ] = useState<string>('GRCh38');
    const [ alignmentFile, setAlignmentFile ] = useState<File>();
    const [ variantFile, setVariantFile ] = useState<File>();
    const [ note, setNote ] = useState<string>('');
    const documentId = useMemo(() => uuid(), []);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!personId) return;
        const loadProfileData = buildLoadObjectFunc<Models.Person>(
            `api/persons/${personId}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            setProfileData
        );
        loadProfileData();
    }, [ personId ]);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if(!alignmentFile && !variantFile) {
            NotificationManager.error(resolveText('Document_NoFileSelected'));
            return;
        }
        if(!profileData) {
            NotificationManager.error(resolveText('PleaseSelect_Patient'));
            return;
        }
        setIsSubmitting(true);
        try {
            if(!!alignmentFile) {
                const document = buildDocument(alignmentFile.name);
                const testResult = buildTestResult(document.id);
                await apiClient.instance!.put(`api/documents/${documentId}`, {}, document);
                await apiClient.instance!.put(`api/documents/${documentId}/upload`, {}, alignmentFile, { stringifyBody: false });
                await apiClient.instance!.put(`api/testresults/${testResult.id}`, {}, testResult);
            }
            if(!!variantFile) {
                const document = buildDocument(variantFile.name);
                const testResult = buildTestResult(document.id);
                await apiClient.instance!.put(`api/documents/${documentId}`, {}, document);
                await apiClient.instance!.put(`api/documents/${documentId}/upload`, {}, variantFile, { stringifyBody: false });
                await apiClient.instance!.put(`api/testresults/${testResult.id}`, {}, testResult);
            }
            if(!!referenceGenome) {
                const referenceGenomeTestResult = buildReferenceGeneomeTestResult();
                await apiClient.instance!.put(`api/testresults/${referenceGenomeTestResult.id}`, {}, referenceGenomeTestResult);
            }
            NotificationManager.success(resolveText('Patient_Document_SuccessfullyStored'));
            navigate(-1);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('Patient_Document_CouldNotStore'));
        } finally {
            setIsSubmitting(false);
        }
    }
    const buildReferenceGeneomeTestResult = (): Models.DiagnosticTestResults.NominalDiagnosticTestResult => {
        return {
            id: uuid(),
            type: HealthRecordEntryType.TestResult,
            createdBy: user!.username,
            timestamp: new Date(),
            personId: profileData!.id,
            scaleType: DiagnosticTestScaleType.Nominal,
            testCodeLoinc: "62374-4",
            testName: "Human reference sequence assembly version",
            value: referenceGenome
        };
    }
    const buildTestResult = (documentId: string): Models.DiagnosticTestResults.DocumentDiagnosticTestResult => {
        return {
            id: uuid(),
            type: HealthRecordEntryType.TestResult,
            createdBy: user!.username,
            timestamp: new Date(),
            documentId: documentId,
            personId: profileData!.id,
            scaleType: DiagnosticTestScaleType.Document,
            testCodeLoinc: "86206-0",
            testName: "Whole genome sequence analysis in Blood or Tissue by Molecular genetics method"
        }
    }
    const buildDocument = (fileName: string): Models.PatientDocument => {
        return {
            id: documentId,
            type: HealthRecordEntryType.Document,
            personId: profileData!.id,
            createdBy: user!.username,
            timestamp: new Date(),
            note: note,
            fileName: fileName
        };
    }

    return (
        <>
            <h1>{resolveText("Genome_Upload")}</h1>
            <Form onSubmit={submit}>
                <FormGroup>
                    <FormLabel>{resolveText("Genome_ReferenceSequence")}</FormLabel>
                    <FormControl
                        required={!!alignmentFile}
                        value={referenceGenome}
                        onChange={(e:any) => setReferenceGenome(e.target.value)}
                    >
                        <option value="GRCh38">GRCh38 (hg38)</option>
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Genome_Alignment")}</FormLabel>
                    <FileUpload
                        onDrop={files => setAlignmentFile(files[0])}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Genome_Variants")}</FormLabel>
                    <FileUpload
                        onDrop={files => setVariantFile(files[0])}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Patient_Document_Note")}</FormLabel>
                    <FormControl
                        as="textarea"
                        value={note}
                        onChange={(e:any) => setNote(e.target.value)}
                    />
                </FormGroup>
                <AsyncButton
                    type="submit"
                    activeText={resolveText('Submit')}
                    executingText={resolveText('Submitting...')}
                    isExecuting={isSubmitting}
                    disabled={!alignmentFile && !variantFile}
                />
            </Form>
        </>
    );

}