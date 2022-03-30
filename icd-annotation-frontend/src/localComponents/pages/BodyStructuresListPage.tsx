import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { NotificationManager } from 'react-notifications';
import { apiClient } from "../../sharedCommonComponents/communication/ApiClient";
import { unselectAll, TreeView } from "../../sharedCommonComponents/components/TreeView";
import { BodyStructuresFilter } from "../components/BodyStructuresList/BodyStructuresFilter";
import { BodyStructuresFilters, BodyStructuresList } from "../components/BodyStructuresList/BodyStructuresList";
import { getSelectedDiseaseCodes } from "../helpers/TreeViewHelpers";
import { Update } from "../types/frontendtypes";
import { Models } from "../types/models";

interface BodyStructuresListPageProps {

}
type IcdChapter = Models.Icd.IcdChapter;

export const BodyStructuresListPage = (props: BodyStructuresListPageProps) => {

    const [filter, setFilter] = useState<BodyStructuresFilters>({});
    const [ diseaseHierarchy, setDiseaseHierarchy] = useState<IcdChapter[]>([]);
    const [ selectedBodyStructure, setSelectedBodyStructure ] = useState<Models.Symptoms.BodyStructure>();

    useEffect(() => {
        const loadDiseaseHierarchy = async () => {
            const response = await apiClient.instance!.get('api/diseases/icdchapters', {});
            const hierarchy = await response.json() as IcdChapter[];
            setDiseaseHierarchy(hierarchy.filter((item, idx) => idx < 23));
        }
        loadDiseaseHierarchy();
    }, []);

    const onBodyStructureSelected = (bodyStructure: Models.Symptoms.BodyStructure) => {
        setSelectedBodyStructure(bodyStructure);
    }
    const onDiseaseSelectionChanged = (listUpdate: Update<Models.Icd.IIcdEntry[]>) => {
        const updateDiseaseHierarchy = listUpdate(diseaseHierarchy) as IcdChapter[];
        setDiseaseHierarchy(updateDiseaseHierarchy);
    }
    const unselectAllDiseases = () => {
        const unselectedDiseaseHierarchy = unselectAll(diseaseHierarchy);
        setDiseaseHierarchy(unselectedDiseaseHierarchy as IcdChapter[]);
    }
    const assignBodyStructureToDiseases = async () => {
        const selectedDiseases = getSelectedDiseaseCodes(diseaseHierarchy);
        try {
            await apiClient.instance!.post(`api/bodystructures/${selectedBodyStructure?.id}/batchassign`, {}, selectedDiseases);
            NotificationManager.success('Body structures assigned to selected diseases');
        } catch(error: any) {
            NotificationManager.error(error.message, 'Could not assign body structure');
        }
    }
    const removeBodyStructureFromDiseases = async () => {
        const selectedDiseases = getSelectedDiseaseCodes(diseaseHierarchy);
        try {
            await apiClient.instance!.post(`api/bodystructures/${selectedBodyStructure?.id}/batchremove`, {}, selectedDiseases);
            NotificationManager.success('Body structures removed from selected diseases');
        } catch(error: any) {
            NotificationManager.error(error.message, 'Could not remove body structure');
        }
    }

    return (
        <>
            <h1>Body structures</h1>
            <BodyStructuresFilter setFilter={setFilter} />
            <BodyStructuresList 
                filter={filter}
                onBodyStructureSelected={onBodyStructureSelected}
            />
            <hr />
            <p>
                {selectedBodyStructure ? <span>Selected observation: <b>{selectedBodyStructure?.name}</b></span> : null}
            </p>
            <Button className="mx-1" onClick={assignBodyStructureToDiseases} disabled={!selectedBodyStructure}>Assign body structure to selected diseases</Button>
            <Button className="mx-1" onClick={removeBodyStructureFromDiseases} disabled={!selectedBodyStructure}>Remove body structure from selected diseases</Button>
            <hr />
            <Button className="m-2" size="sm" onClick={unselectAllDiseases}>Unselect all</Button>
            <TreeView<Models.Icd.IIcdEntry>
                items={diseaseHierarchy}
                displayFunc={item => item.name}
                onSelectionChanged={onDiseaseSelectionChanged}
                selectable={true}
            />
        </>
    );
}