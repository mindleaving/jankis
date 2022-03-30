import React, { useEffect, useState } from 'react';
import { SymptomFilter } from '../components/SymptomsList/SymptomFilter';
import { SymptomsFilters, SymptomsList } from '../components/SymptomsList/SymptomsList';
import { Models } from '../types/models';
import { Update } from '../types/frontendtypes';
import { Button } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { getSelectedDiseaseCodes } from '../helpers/TreeViewHelpers';
import { apiClient } from '../../sharedCommonComponents/communication/ApiClient';
import { unselectAll, TreeView } from '../../sharedCommonComponents/components/TreeView';

interface SymptomsListPageProps {

}
type IcdChapter = Models.Icd.IcdChapter;

export const SymptomsListPage = (props: SymptomsListPageProps) => {

    const [filter, setFilter] = useState<SymptomsFilters>({});
    const [ diseaseHierarchy, setDiseaseHierarchy] = useState<IcdChapter[]>([]);
    const [ selectedSymptom, setSelectedSymptom ] = useState<Models.Symptoms.Symptom>();

    useEffect(() => {
        const loadDiseaseHierarchy = async () => {
            const response = await apiClient.instance!.get('api/diseases/icdchapters', {});
            const hierarchy = await response.json() as IcdChapter[];
            setDiseaseHierarchy(hierarchy.filter((item, idx) => idx < 23));
        }
        loadDiseaseHierarchy();
    }, []);

    const onDiseaseSelectionChanged = (listUpdate: Update<Models.Icd.IIcdEntry[]>) => {
        const updateDiseaseHierarchy = listUpdate(diseaseHierarchy) as IcdChapter[];
        setDiseaseHierarchy(updateDiseaseHierarchy);
    }
    const onSymptomSelected = (symptom: Models.Symptoms.Symptom) => {
        setSelectedSymptom(symptom);
    }
    const assignSymptomToDiseases = async () => {
        const selectedDiseases = getSelectedDiseaseCodes(diseaseHierarchy);
        try {
            await apiClient.instance!.post(`api/symptoms/${selectedSymptom?.id}/batchassign`, {}, selectedDiseases);
            NotificationManager.success('Symptom assigned to selected diseases');
        } catch(error: any) {
            NotificationManager.error(error.message, 'Could not assign symptoms');
        }
    }
    const removeSymptomFromDiseases = async () => {
        const selectedDiseases = getSelectedDiseaseCodes(diseaseHierarchy);
        try {
            await apiClient.instance!.post(`api/symptoms/${selectedSymptom?.id}/batchremove`, {}, selectedDiseases);
            NotificationManager.success('Symptom removed from selected diseases');
        } catch(error: any) {
            NotificationManager.error(error.message, 'Could not remove symptoms');
        }
    }
    const unselectAllDiseases = () => {
        const unselectedDiseaseHierarchy = unselectAll(diseaseHierarchy);
        setDiseaseHierarchy(unselectedDiseaseHierarchy as IcdChapter[]);
    }

    return (
        <>
            <h1>Symptoms</h1>
            <SymptomFilter setFilter={setFilter} />
            <SymptomsList 
                filter={filter}
                onSymptomSelected={onSymptomSelected}
            />
            <hr />
            <p>
                {selectedSymptom ? <span>Selected symptom: <b>{selectedSymptom?.name}</b></span> : null}
            </p>
            <Button className="mx-1" onClick={assignSymptomToDiseases} disabled={!selectedSymptom}>Assign symptom to selected diseases</Button>
            <Button className="mx-1" onClick={removeSymptomFromDiseases} disabled={!selectedSymptom}>Remove symptom from selected diseases</Button>
            <hr />
            <Button className="m-2" size="sm" onClick={unselectAllDiseases}>Unselect all</Button>
            <TreeView<Models.Icd.IIcdEntry>
                items={diseaseHierarchy}
                displayFunc={item => item.name}
                onSelectionChanged={onDiseaseSelectionChanged}
                selectable
            />
        </>
    )
}