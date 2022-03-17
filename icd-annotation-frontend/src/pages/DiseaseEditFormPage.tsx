import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import { apiClient } from '../communication/ApiClient';
import { Models } from '../types/models.d';
import { resolveText } from '../helpers/Globalizer';
import { AsyncButton } from '../components/AsyncButton';
import { RouteComponentProps } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { BodyStructuresSection } from '../components/DiseaseEditForm/BodyStructuresSection';
import { IncidenceSection } from '../components/DiseaseEditForm/IncidenceSection';
import { PrevalenceSection } from '../components/DiseaseEditForm/PrevalenceSection';
import { MortalitySection } from '../components/DiseaseEditForm/MortalitySection';
import { DiagnosticCriteriasSection } from '../components/DiseaseEditForm/DiagnosticCriteriasSection';
import { SymptomsSection } from '../components/DiseaseEditForm/SymptomsSection';
import { PathogensSection } from '../components/DiseaseEditForm/PathogensSection';
import { DiseaseHostsSection } from '../components/DiseaseEditForm/DiseaseHostsSection';
import { ObservationsSection } from '../components/DiseaseEditForm/ObservationsSection';
import { ReferencesSection } from '../components/DiseaseEditForm/ReferencesSection';
import { IcdTreeViewEntry, Update } from '../types/frontendtypes';
import { TreeView } from '../components/TreeView';
import { TransferControls } from '../components/DiseaseEditForm/TransferControls';
import { DiseaseLocks } from '../components/DiseaseEditForm/DiseaseLocks';

interface DiseaseEditFormPageParams {
    icdCode: string;
}
interface DiseaseEditFormPageProps {
    username?: string;
}

export const DiseaseEditFormPage = (props: DiseaseEditFormPageProps) => {

    const isNew = location.pathname === "/diseases/new";
    const matchedIcdCode = icdCode ?? '';
    

    const [isStoring, setIsStoring] = useState<boolean>(false);
    const [isLockedByOtherUser, setIsLockedByOtherUser] = useState<boolean>(false);
    const [icdCode, setIcdCode] = useState<string>(matchedIcdCode);
    const [categoryIcdCode, setCategoryIcdCode] = useState<string>('');
    const [name, setName] = useState<string>('');

    const [incidenceDataPoints, setIncidenceDataPoints] = useState<Models.Icd.Annotation.Epidemiology.IncidenceDataPoint[]>([]);
    const [prevalenceDataPoints, setPrevalenceDataPoints] = useState<Models.Icd.Annotation.Epidemiology.PrevalenceDataPoint[]>([]);
    const [mortalityDataPoints, setMortalityDataPoints] = useState<Models.Icd.Annotation.Epidemiology.MortalityDataPoint[]>([]);

    const [affectedBodyStructures, setAffectedBodyStructures] = useState<Models.Symptoms.BodyStructure[]>([]);
    const [diagnosticCriterias, setDiagnosticCriterias] = useState<Models.Icd.Annotation.Diagnostics.IDiagnosticCriteria[]>([]);
    const [riskFactors, setRiskFactors] = useState<Models.Icd.Annotation.Epidemiology.RiskFactor[]>([]);
    const [symptoms, setSymptoms] = useState<Models.Symptoms.Symptom[]>([]);
    const [observations, setObservations ] = useState<Models.Icd.Annotation.Diagnostics.Observation[]>([]);

    const [isInfectiousDisease, setIsInfectiousDisease] = useState<boolean>(false);
    const [pathogens, setPathogens] = useState<Models.Icd.Annotation.Epidemiology.Microb[]>([]);
    const [hosts, setHosts] = useState<Models.Icd.Annotation.Epidemiology.DiseaseHost[]>([]);

    const [references, setReferences] = useState<string[]>([]);

    const [descendants, setDescendants ] = useState<IcdTreeViewEntry[]>([]);

    useEffect(() => {
        if (isNew) return;
        const loadDisease = async () => {
            try {
                const response = await apiClient.instance!.get(`api/diseases/${matchedIcdCode}`, {});
                const disease = await response.json() as Models.Icd.Annotation.Disease;
                setIcdCode(disease.icdCode);
                setCategoryIcdCode(disease.categoryIcdCode ?? '');
                setName(disease.name);
                setAffectedBodyStructures(disease.affectedBodyStructures);
                setDiagnosticCriterias(disease.diagnosticCriteria);
                setIncidenceDataPoints(disease.epidemiology.incidenceDataPoints);
                setPrevalenceDataPoints(disease.epidemiology.prevalenceDataPoints);
                setMortalityDataPoints(disease.epidemiology.mortalityDataPoints);
                setRiskFactors(disease.riskFactors);
                setSymptoms(disease.symptoms);
                setObservations(disease.observations);
                const infectiousDisease = disease as Models.Icd.Annotation.InfectiousDisease;
                if (infectiousDisease.hosts !== undefined) {
                    setIsInfectiousDisease(true);
                    setPathogens(infectiousDisease.pathogens);
                    setHosts(infectiousDisease.hosts);
                }
                setReferences(disease.references);
            } catch (error) {
                NotificationManager.error(error.message, 'Could not load disease');
            }
        }
        const loadDescendants = async () => {
            try {
                const response = await apiClient.instance!.get('api/diseases/hierarchy', { prefix: matchedIcdCode});
                const items: IcdTreeViewEntry[]  = await response.json();
                if(items.length > 0 && items[0].subEntries.length > 0) {
                    items[0].isInitiallyExpanded = true;
                    setDescendants(items);
                } else {
                    setDescendants([]);
                }
            } catch(error: any) {
                NotificationManager.error(error.message, 'Could not load descendants');
            }
        }
        loadDisease();
        loadDescendants();
    }, [isNew, matchedIcdCode]);


    const onDiseaseSelectionChanged = (listUpdate: Update<IcdTreeViewEntry[]>) => {
        const updateDiseaseHierarchy = listUpdate(descendants) as IcdTreeViewEntry[];
        setDescendants(updateDiseaseHierarchy);
    }

    const buildDisease = (): Models.Icd.Annotation.Disease | Models.Icd.Annotation.InfectiousDisease => {
        const epidemiology: Models.Icd.Annotation.Epidemiology.DiseaseEpidemiology = {
            incidenceDataPoints: incidenceDataPoints,
            prevalenceDataPoints: prevalenceDataPoints,
            mortalityDataPoints: mortalityDataPoints
        };
        const disease: Models.Icd.Annotation.Disease = {
            icdCode: icdCode,
            categoryIcdCode: categoryIcdCode,
            name: name,
            affectedBodyStructures: affectedBodyStructures,
            diagnosticCriteria: diagnosticCriterias,
            epidemiology: epidemiology,
            riskFactors: riskFactors,
            symptoms: symptoms,
            observations: observations,
            references: references
        };
        if (!isInfectiousDisease) {
            return disease;
        }
        const infectiousDisease: Models.Icd.Annotation.InfectiousDisease = Object.assign(disease, {
            pathogens: pathogens,
            hosts: hosts
        });
        return infectiousDisease;
    }
    const store = async () => {
        const disease: Models.Icd.Annotation.Disease = buildDisease();
        try {
            setIsStoring(true);
            await apiClient.instance!.put(`/api/diseases/${disease.icdCode}`, {}, disease);
            NotificationManager.success('Disease was stored :)');
        } catch (error) {
            NotificationManager.error(error.message, 'Could not store disease');
        } finally {
            setIsStoring(false);
        }
    }

    return (
        <>
            {!isNew ? <DiseaseLocks icdCode={matchedIcdCode} username={props.username} onLockChanged={setIsLockedByOtherUser} /> : null}
            <h1>{name}</h1>
            <Form className="mb-3">
                <Accordion>
                    <Form.Group as={Row}>
                        <Form.Label as={Col}>ICD Code</Form.Label>
                        <Col>
                            <Form.Control required
                                type="text"
                                value={icdCode}
                                onChange={(e: any) => setIcdCode(e.target.value)}
                                isInvalid={!icdCode}
                                disabled={!isNew}
                            />
                            <Form.Control.Feedback  type="invalid">ICD 11 code must be specified</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label as={Col}>Title</Form.Label>
                        <Col>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e: any) => setName(e.target.value)}
                                isInvalid={!name}
                                disabled={!isNew}
                            />
                            <Form.Control.Feedback type="invalid">Name must not be empty</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label as={Col}>Category ICD Code</Form.Label>
                        <Col>
                            <Form.Control
                                disabled
                                type="text"
                                value={categoryIcdCode}
                                onChange={(e: any) => setCategoryIcdCode(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    
                    <IncidenceSection incidenceDataPoints={incidenceDataPoints} setIncidenceDataPoints={setIncidenceDataPoints} disabled={isLockedByOtherUser} />
                    <PrevalenceSection prevalenceDataPoints={prevalenceDataPoints} setPrevalenceDataPoints={setPrevalenceDataPoints} disabled={isLockedByOtherUser} />
                    <MortalitySection mortalityDataPoints={mortalityDataPoints} setMortalityDataPoints={setMortalityDataPoints} disabled={isLockedByOtherUser} />
                    <BodyStructuresSection affectedBodyStructures={affectedBodyStructures} setAffectedBodyStructures={setAffectedBodyStructures} disabled={isLockedByOtherUser} />
                    <SymptomsSection symptoms={symptoms} setSymptoms={setSymptoms} disabled={isLockedByOtherUser} />
                    <ObservationsSection observations={observations} setObservations={setObservations} disabled={isLockedByOtherUser} />
                    <DiagnosticCriteriasSection diagnosticCriterias={diagnosticCriterias} setDiagnosticCriterias={setDiagnosticCriterias} disabled={isLockedByOtherUser} />

                    {/* ------- Infectious disease ----------- */}
                    <Form.Group as={Row}>
                        <Form.Label as={Col}>Is infectious disease</Form.Label>
                        <Col>
                            <Form.Check
                                disabled={isLockedByOtherUser}
                                checked={isInfectiousDisease}
                                onChange={(e: any) => setIsInfectiousDisease(e.target.checked)}
                            />
                        </Col>
                    </Form.Group>
                    {isInfectiousDisease ?
                        <>
                            <PathogensSection pathogens={pathogens} setPathogens={setPathogens} disabled={isLockedByOtherUser} />
                            <DiseaseHostsSection hosts={hosts} setHosts={setHosts} disabled={isLockedByOtherUser} />
                        </> : null
                    }
                    <ReferencesSection references={references} setReferences={setReferences} disabled={isLockedByOtherUser} />

                    <AsyncButton
                        onClick={store}
                        disabled={isLockedByOtherUser}
                        isExecuting={isStoring}
                        activeText={resolveText('Store')}
                        executingText={resolveText('Storing')}
                    />
                </Accordion>
            </Form>

            {descendants.length > 0 && !isLockedByOtherUser 
            ? <div className="my-3 py-3">
                <h3>Descendant diseases</h3>
                <hr />
                <TransferControls
                    icdCode={matchedIcdCode}
                    symptoms={symptoms}
                    observations={observations}
                    bodyStructures={affectedBodyStructures}
                    isInfectiousDisease={isInfectiousDisease}
                    pathogens={pathogens}
                    diseaseHosts={hosts}
                    selectedDiseases={descendants}
                />
                <hr />
                <TreeView<IcdTreeViewEntry>
                    items={descendants}
                    displayFunc={x => x.name}
                    selectable
                    onSelectionChanged={onDiseaseSelectionChanged}
                />
            </div> : null}
        </>
    )
}