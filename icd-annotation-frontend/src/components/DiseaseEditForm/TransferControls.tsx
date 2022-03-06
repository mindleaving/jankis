import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { NotificationManager } from 'react-notifications';
import { formatBodyStructure } from '../../helpers/Formatters';
import { Models } from '../../types/models';
import { AsyncButton } from '../AsyncButton';
import { getSelectedDiseaseCodes } from '../../helpers/TreeViewHelpers';
import { ITreeViewItem } from '../TreeView';
import { apiClient } from '../../communication/ApiClient';
import { firstLetterToUpper } from '../../helpers/StringExtensions';

export enum TransferActionType {
    Add = "add",
    Remove = "remove"
}
export enum TransferCount {
    One = "one",
    All = "all"
}
export enum TransferObjectType {
    Symptoms = "symptoms",
    Observations = "observations",
    BodyStructures = "bodyStructures",
    Pathogens = "pathogens",
    DiseaseHosts = "hosts"
}
interface TransferControlsProps {
    icdCode: string,
    symptoms: Models.Symptoms.Symptom[];
    observations: Models.Icd.Annotation.Diagnostics.Observation[];
    bodyStructures: Models.Symptoms.BodyStructure[];
    isInfectiousDisease: boolean;
    pathogens: Models.Icd.Annotation.Epidemiology.Microb[];
    diseaseHosts: Models.Icd.Annotation.Epidemiology.DiseaseHost[];
    selectedDiseases: (Models.Icd.IcdCategory & ITreeViewItem)[];
}

export const TransferControls = (props: TransferControlsProps) => {

    const [actionType, setActionType] = useState<TransferActionType>(TransferActionType.Add);
    const [count, setCount] = useState<TransferCount>(TransferCount.All);
    const [objectType, setObjectType ] = useState<TransferObjectType>(TransferObjectType.Symptoms);
    const [selectedItemId, setSelectedItemId ] = useState<string>('');
    const [isTransferring, setIsTransferring] = useState<boolean>(false);

    const canTransfer = () => {
        if(count === TransferCount.One && !selectedItemId) {
            return false;
        }
        const selectedDiseases = getSelectedDiseaseCodes(props.selectedDiseases);
        if(selectedDiseases.length === 0) {
            return false;
        }
        return true;
    }
    const transfer = async () => {
        switch(objectType) {
            case TransferObjectType.Symptoms:
                await transferItemsToSelectedDescendants(props.symptoms, x => x.id, 'symptom');
                break;
            case TransferObjectType.Observations:
                await transferItemsToSelectedDescendants(props.observations, x => x.id, 'observation');
                break;
            case TransferObjectType.BodyStructures:
                await transferItemsToSelectedDescendants(props.bodyStructures, x => x.id, 'bodystructure');
                break;
            case TransferObjectType.Pathogens:
                await transferItemsToSelectedDescendants(props.pathogens, x => x.icdCode, 'microb');
                break;
            case TransferObjectType.DiseaseHosts:
                await transferItemsToSelectedDescendants(props.diseaseHosts, x => x.id, 'diseasehost');
                break;
            default:
                throw new Error(`Transfer of object type '${objectType}' is not implemented`);
        }
    }
    const transferItemsToSelectedDescendants = async <T extends unknown>(items: T[], idSelector: (item: T) => string, typeName: string) => {
        setIsTransferring(true);
        const selectedDiseases = getSelectedDiseaseCodes(props.selectedDiseases)
            .filter(x => x !== props.icdCode); // Remove current disease
        try {
            for(const item of items) {
                await apiClient.post(`api/${typeName}s/${idSelector(item)}/batchassign`, {}, selectedDiseases);
            }
            NotificationManager.success(`${firstLetterToUpper(typeName)}s successfully transferred`);
        } catch(error) {
            NotificationManager.error(error.message, `Could not transfer ${typeName.toLowerCase()}s`);
        } finally {
            setIsTransferring(false);
        }
    }

    return (
        <Form inline>
            <Form.Row>
                <Form.Control
                    as="select"
                    className="mx-1"
                    value={actionType}
                    onChange={(e:any) => setActionType(e.target.value)}
                >
                    <option value={TransferActionType.Add}>Add</option>
                    <option value={TransferActionType.Remove}>Remove</option>
                </Form.Control>
                <Form.Control
                    as="select"
                    className="mx-1"
                    value={count}
                    onChange={(e:any) => setCount(e.target.value)}
                >
                    <option value={TransferCount.One}>one</option>
                    <option value={TransferCount.All}>all</option>
                </Form.Control>
                <Form.Label>of the above</Form.Label>
                <Form.Control
                    as="select"
                    className="mx-1"
                    value={objectType}
                    onChange={(e:any) => { setObjectType(e.target.value); setSelectedItemId(''); }}
                >
                    <option value={TransferObjectType.Symptoms}>{count === TransferCount.All ? 'symptoms' : 'symptom'}</option>
                    <option value={TransferObjectType.Observations}>observations</option>
                    <option value={TransferObjectType.BodyStructures}>body structures</option>
                    {props.isInfectiousDisease ? <>
                    <option value={TransferObjectType.Pathogens}>pathogens</option>
                    <option value={TransferObjectType.DiseaseHosts}>disease hosts</option>
                    </> : null}
                </Form.Control>
                {count === TransferCount.One
                ? <Form.Control
                    as="select"
                    className="mx-1"
                    value={selectedItemId}
                    onChange={(e:any) => setSelectedItemId(e.target.value)}
                >
                    <option value="" disabled>Please select...</option>
                    {objectType === TransferObjectType.Symptoms 
                        ? props.symptoms.map(symptom => <option key={symptom.id} value={symptom.id}>{symptom.name}</option>)
                    : objectType === TransferObjectType.Observations 
                        ? props.observations.map(observation => <option key={observation.id} value={observation.id}>{observation.name}</option>)
                    : objectType === TransferObjectType.BodyStructures 
                        ? props.bodyStructures.map(bodyStructure => <option key={bodyStructure.id} value={bodyStructure.id}>{formatBodyStructure(bodyStructure)}</option>)
                    : props.isInfectiousDisease && objectType === TransferObjectType.Pathogens 
                        ? props.pathogens.map(pathogen => <option key={pathogen.icdCode} value={pathogen.icdCode}>{pathogen.name}</option>)
                    : props.isInfectiousDisease && objectType === TransferObjectType.DiseaseHosts 
                        ? props.diseaseHosts.map(host => <option key={host.id} value={host.id}>{host.name}</option>)
                    : null}
                </Form.Control>
                : null}
                <Form.Label>{actionType === TransferActionType.Add ? 'to selected descendants' : 'from selected descendants'}</Form.Label>
                <AsyncButton
                    className="mx-3"
                    onClick={transfer}
                    activeText="Execute!"
                    executingText="Executing..."
                    isExecuting={isTransferring}
                    disabled={!canTransfer()}
                />
            </Form.Row>
        </Form>
    );
}