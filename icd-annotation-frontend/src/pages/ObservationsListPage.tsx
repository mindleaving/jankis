import React, { useEffect, useState } from 'react';
import { apiClient } from '../communication/ApiClient';
import { ObservationFilter } from '../components/ObservationsList/ObservationFilter';
import { ObservationsFilters, ObservationsList } from '../components/ObservationsList/ObservationsList';
import { TreeView, unselectAll } from '../components/TreeView';
import { Models } from '../types/models';
import { Update } from '../types/frontendtypes.d';
import { Button } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { getSelectedDiseaseCodes } from '../helpers/TreeViewHelpers';

interface ObservationsListPageProps {

}
type IcdChapter = Models.Icd.IcdChapter;

export const ObservationsListPage = (props: ObservationsListPageProps) => {

    const [filter, setFilter] = useState<ObservationsFilters>({});
    const [ diseaseHierarchy, setDiseaseHierarchy] = useState<IcdChapter[]>([]);
    const [ selectedObservation, setSelectedObservation ] = useState<Models.Icd.Annotation.Diagnostics.Observation>();

    useEffect(() => {
        const loadDiseaseHierarchy = async () => {
            const response = await apiClient.get('api/diseases/icdchapters', {});
            const hierarchy = await response.json() as IcdChapter[];
            setDiseaseHierarchy(hierarchy.filter((item, idx) => idx < 23));
        }
        loadDiseaseHierarchy();
    }, []);

    const onDiseaseSelectionChanged = (listUpdate: Update<Models.Icd.IIcdEntry[]>) => {
        const updateDiseaseHierarchy = listUpdate(diseaseHierarchy) as IcdChapter[];
        setDiseaseHierarchy(updateDiseaseHierarchy);
    }
    const onObservationSelected = (observation: Models.Icd.Annotation.Diagnostics.Observation) => {
        setSelectedObservation(observation);
    }
    const assignObservationToDiseases = async () => {
        const selectedDiseases = getSelectedDiseaseCodes(diseaseHierarchy);
        try {
            await apiClient.post(`api/observations/${selectedObservation?.id}/batchassign`, {}, selectedDiseases);
            NotificationManager.success('Observation assigned to selected diseases');
        } catch(error) {
            NotificationManager.error(error.message, 'Could not assign observations');
        }
    }
    const removeObservationFromDiseases = async () => {
        const selectedDiseases = getSelectedDiseaseCodes(diseaseHierarchy);
        try {
            await apiClient.post(`api/observations/${selectedObservation?.id}/batchremove`, {}, selectedDiseases);
            NotificationManager.success('Observation removed from selected diseases');
        } catch(error) {
            NotificationManager.error(error.message, 'Could not remove observations');
        }
    }
    const unselectAllDiseases = () => {
        const unselectedDiseaseHierarchy = unselectAll(diseaseHierarchy);
        setDiseaseHierarchy(unselectedDiseaseHierarchy as IcdChapter[]);
    }

    return (
        <>
            <h1>Observations</h1>
            <ObservationFilter setFilter={setFilter} />
            <ObservationsList 
                filter={filter}
                onObservationSelected={onObservationSelected}
            />
            <hr />
            <p>
                {selectedObservation ? <span>Selected observation: <b>{selectedObservation?.name}</b></span> : null}
            </p>
            <Button className="mx-1" onClick={assignObservationToDiseases} disabled={!selectedObservation}>Assign observation to selected diseases</Button>
            <Button className="mx-1" onClick={removeObservationFromDiseases} disabled={!selectedObservation}>Remove observation from selected diseases</Button>
            <hr />
            <Button className="m-2" size="sm" onClick={unselectAllDiseases}>Unselect all</Button>
            <TreeView<Models.Icd.IIcdEntry>
                items={diseaseHierarchy}
                displayFunc={item => item.name}
                onSelectionChanged={onDiseaseSelectionChanged}
                selectable={true}
            />
        </>
    )
}