import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Models } from '../../../localComponents/types/models';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row, Table } from 'react-bootstrap';
import { distinct } from '../../../sharedCommonComponents/helpers/CollectionHelpers';
import { v4 as uuid } from 'uuid';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';

interface GenomeExplorationPageProps {}

export const GenomeExplorationPage = (props: GenomeExplorationPageProps) => {

    const { personId } = useParams();
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ referenceSequences, setReferenceSequences ] = useState<string[]>([]);
    const [ sequencingDocuments, setSequencingDocuments ] = useState<Models.PatientDocument[]>([]);
    const [ deployments, setDeployments ] = useState<Models.GenomeExplorerDeployment[]>([]);
    const [ selectedReferenceSequences, setSelectedReferenceSequences ] = useState<string[]>([]);
    const [ selectedDocumentIds, setSelectedDocumentIds ] = useState<string[]>([]);
    const [ isDeploying, setIsDeploying ] = useState<boolean>(false);

    useEffect(() => {
        if(!personId) return;
        const loadGenomeSequences = buildLoadObjectFunc<ViewModels.PersonGenomeSequencesViewModel>(
            `api/viewmodels/genomesequences/${personId}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            vm => {
                setProfileData(vm.person);
                setSequencingDocuments(vm.documents);
                setReferenceSequences(distinct(vm.referenceSequences.map(x => x.value)));
                setDeployments(vm.deployments);
            }
        );
        loadGenomeSequences();
    }, [ personId ]);


    const deployGenomeExplorer = async () => {
        if(!profileData) {
            return;
        }
        setIsDeploying(true);
        try {
            const deploymentInfo: Models.GenomeExplorerDeployment = {
                id: uuid(),
                personId: profileData!.id,
                referenceSequences: selectedReferenceSequences,
                documentIds: selectedDocumentIds,
            };
            const response = await apiClient.instance!.post(`api/genomeexplorer/deploy`, {}, deploymentInfo);
            const environmentUrl = await response.text();
            window.open(environmentUrl, "_blank")?.focus();
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("GenomeExplorer_CouldNotDeploy"));
        } finally {
            setIsDeploying(false);
        }
    }

    const addDocument = (documentId: string) => {
        setSelectedDocumentIds(state => state.includes(documentId) ? state : state.concat(documentId));
    }
    const removeDocument = (documentId: string) => {
        setSelectedDocumentIds(state => state.filter(x => x !== documentId));
    }
    const addReferenceSequence = (referenceSequence: string) => {
        setSelectedReferenceSequences(state => state.includes(referenceSequence) ? state : state.concat(referenceSequence));
    }
    const removeReferenceSequence = (referenceSequence: string) => {
        setSelectedReferenceSequences(state => state.filter(x => x !== referenceSequence));
    }

    return (
        <>
            <h1>{resolveText("Genome_Explore")}</h1>
            <Form onSubmit={deployGenomeExplorer}>
                <FormGroup>
                    <FormLabel>{resolveText("GenomeExplorer_ReferenceSequences")}</FormLabel>
                    <FormControl
                        as="select"
                        value=""
                        onChange={(e: any) => addReferenceSequence(e.target.value)}
                    >
                        <option value="" disabled>{resolveText("PleaseSelect...")}</option>
                        {referenceSequences.map(referenceSequence => (
                            <option key={referenceSequence} value={referenceSequence}>{referenceSequence}</option>
                        ))}
                    </FormControl>
                </FormGroup>
                <Row>
                    <Col>
                        <ListFormControl
                            items={selectedReferenceSequences}
                            idFunc={x => x}
                            displayFunc={x => x}
                            removeItem={removeReferenceSequence}
                        />
                    </Col>
                </Row>
                <FormGroup>
                    <FormLabel>{resolveText("GenomeExplorer_Tracks")}</FormLabel>
                    <FormControl
                        as="select"
                        value=""
                        onChange={(e: any) => addDocument(e.target.value)}
                    >
                        <option value="" disabled>{resolveText("PleaseSelect...")}</option>
                        {sequencingDocuments.map(document => (
                            <option key={document.id} value={document.id}>{document.fileName}</option>
                        ))}
                    </FormControl>
                </FormGroup>
                <Row>
                    <Col>
                        <ListFormControl
                            items={selectedDocumentIds}
                            idFunc={x => x}
                            displayFunc={x => x}
                            removeItem={removeDocument}
                        />
                    </Col>
                </Row>
                <AsyncButton
                    type='submit'
                    className='m-3'
                    activeText={resolveText("GenomeExplorer_Deploy")}
                    executingText={resolveText("Deploying...")}
                    isExecuting={isDeploying}
                    disabled={selectedDocumentIds.length === 0 && selectedReferenceSequences.length === 0}
                />
            </Form>

            <hr />

            <h3>{resolveText("GenomeExplorer_ExistingDeployments")}</h3>
            <Table>
                <thead>
                    <tr>
                        <th>{resolveText("GenomeExplorer_Id")}</th>
                        <th>{resolveText("GenomeExplorer_ReferenceSequences")}</th>
                        <th>{resolveText("GenomeExplorer_Tracks")}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {deployments?.length > 0
                    ? deployments.map(deployment => (
                        <tr key={deployment.id}>
                            <td>{deployment.id}</td>
                            <td>
                                <ul>
                                    {deployment.referenceSequences.length > 0
                                    ? deployment.referenceSequences.map(referenceSequence => (
                                        <ul key={referenceSequence}>{referenceSequence}</ul>
                                    ))
                                    : <ul>{resolveText("None")}</ul>}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {deployment.documentIds.length > 0
                                    ? deployment.documentIds.map(documentId => (
                                        <ul key={documentId}>{documentId}</ul>
                                    ))
                                    : <ul>{resolveText("None")}</ul>}
                                </ul>
                            </td>
                            <td>
                                <Button 
                                    onClick={() => window.open(deployment.environmentUrl)?.focus()}
                                    disabled={!deployment.environmentUrl}
                                >
                                    {resolveText("Open")}
                                </Button>
                            </td>
                        </tr>
                    ))
                    : <tr>
                        <td colSpan={4} className="text-center">{resolveText("NoEntries")}</td>
                    </tr>}
                </tbody>
            </Table>
        </>
    );

}